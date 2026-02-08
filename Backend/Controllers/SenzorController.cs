using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers.Dtos;
using Backend.Models.Enums;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SenzorController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public SenzorController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – svi senzori
        [HttpGet]
        public async Task<ActionResult<List<Senzor>>> DajSenzore()
        {
            try
            {
                return Ok(await baza.Senzori.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // HTTP GET – jedan senzor po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Senzor>> DajSenzor(int id)
        {
            try
            {
                var trazeniSenzor = await baza.Senzori.FindAsync(id);
                if (trazeniSenzor == null) return NotFound();

                return Ok(trazeniSenzor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // POST – kreiranje senzora
        [HttpPost]
        public async Task<ActionResult<Senzor>> KreirajSenzor([FromBody] Senzor noviSenzor)
        {
            try
            {
                if (noviSenzor == null)
                    return BadRequest();

                baza.Senzori.Add(noviSenzor);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajSenzor), new { id = noviSenzor.IdSenzora }, noviSenzor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // PUT – update senzora
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSenzor(int id, [FromBody] Senzor noviSenzor)
        {
            try
            {
                var trazeniSenzor = await baza.Senzori.FindAsync(id);
                if (noviSenzor == null) return BadRequest();
                if (trazeniSenzor == null) return NotFound();

                baza.Entry(trazeniSenzor).CurrentValues.SetValues(noviSenzor);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }

        }

        // DELETE – brisanje senzora
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiSenzor(int id)
        {
            try
            {
                var trazeniSenzor = await baza.Senzori.FindAsync(id);
                if (trazeniSenzor == null) return NotFound();

                baza.Senzori.Remove(trazeniSenzor);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpGet("{id}/validirajPragove")]
        public async Task<ActionResult> ValidirajPragove(int id)
        {
            try
            {
                var senzor = await baza.Senzori.FindAsync(id);
                if (senzor == null) return NotFound(new { Poruka = "Senzor nije pronađen" });

                var validacije = new List<string>();
                var ispravno = true;

                // 1. Normalni min < max
                if (senzor.PragNormalnoMin >= senzor.PragNormalnoMax)
                {
                    validacije.Add("Normalni min mora biti manji od max");
                    ispravno = false;
                }
                else validacije.Add("Normalni pragovi OK");

                // 2. Kritični min < max
                if (senzor.PragCriticalMin >= senzor.PragCriticalMax)
                {
                    validacije.Add("Kritični min mora biti manji od max");
                    ispravno = false;
                }
                else validacije.Add("Kritični pragovi OK");

                // 3. Kritični van normalnog (preporuka)
                if (senzor.PragCriticalMin >= senzor.PragNormalnoMin && senzor.PragCriticalMin <= senzor.PragNormalnoMax)
                    validacije.Add("Kritični min je unutar normalnog");

                if (senzor.PragCriticalMax >= senzor.PragNormalnoMin && senzor.PragCriticalMax <= senzor.PragNormalnoMax)
                    validacije.Add("Kritični max je unutar normalnog");

                return Ok(new
                {
                    Id = senzor.IdSenzora,
                    Naziv = senzor.Naziv,
                    Tip = senzor.TipSenzora.ToString(),
                    Normalno = $"{senzor.PragNormalnoMin} - {senzor.PragNormalnoMax} {senzor.JedinicaMjere}",
                    Kritično = $"{senzor.PragCriticalMin} - {senzor.PragCriticalMax} {senzor.JedinicaMjere}",
                    Validacije = validacije,
                    Ispravno = ispravno
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPost("{id}/kalibrisi")]
        public async Task<ActionResult> Kalibrisi(int id, [FromBody] KalibracijaDto dto)
        {
            try
            {
                var senzor = await baza.Senzori.FindAsync(id);
                if (senzor == null) return NotFound(new { Poruka = "Senzor nije pronađen" });
                if (dto == null) return BadRequest(new { Poruka = "Podaci su obavezni" });

                // Ažuriranje
                senzor.DatumKalibracije = dto.DatumKalibracije ?? DateOnly.FromDateTime(DateTime.Now);
                senzor.Status = Models.Enums.StatusOcitavanja.Normalan;

                // Ažuriranje pragova ako su dati
                if (dto.NoviNormalnoMin.HasValue) senzor.PragNormalnoMin = dto.NoviNormalnoMin.Value;
                if (dto.NoviNormalnoMax.HasValue) senzor.PragNormalnoMax = dto.NoviNormalnoMax.Value;
                if (dto.NoviKriticnoMin.HasValue) senzor.PragCriticalMin = dto.NoviKriticnoMin.Value;
                if (dto.NoviKriticnoMax.HasValue) senzor.PragCriticalMax = dto.NoviKriticnoMax.Value;

                baza.Senzori.Update(senzor);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Senzor kalibriran",
                    Senzor = new { senzor.IdSenzora, senzor.Naziv, senzor.DatumKalibracije, senzor.Status },
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPost("{id}/registrujOcitavanje")]
        public async Task<ActionResult> RegistrujOcitavanje(int id, [FromBody] OcitavanjeDto dto)
        {
            try
            {
                var senzor = await baza.Senzori.FindAsync(id);
                if (senzor == null) return NotFound(new { Poruka = "Senzor nije pronađen" });
                if (!dto.Vrijednost.HasValue) return BadRequest(new { Poruka = "Vrijednost je obavezna" });

                var vrijednost = dto.Vrijednost.Value;
                StatusOcitavanja status;
                string poruka;

                // Određivanje statusa
                if (vrijednost >= senzor.PragNormalnoMin && vrijednost <= senzor.PragNormalnoMax)
                {
                    status = Models.Enums.StatusOcitavanja.Normalan;
                    poruka = "Vrijednost u normalnom rasponu";
                }
                else if (vrijednost >= senzor.PragCriticalMin && vrijednost <= senzor.PragNormalnoMax)
                {
                    status = Models.Enums.StatusOcitavanja.IzvanOpsega;
                    poruka = "Vrijednost izvan normalnog, unutar kritičnog";
                }
                else
                {
                    status = Models.Enums.StatusOcitavanja.Greska;
                    poruka = "Vrijednost izvan kritičnog raspona - GREŠKA!";
                }

                // Zapis očitanja
                var ocitavanje = new OcitanjeSenzora
                {
                    IdSenzora = id,
                    Vrijednost = vrijednost,
                    Timestamp = DateTime.Now,
                    StatusOcitanja = status,
                    Napomena = dto.Napomena
                };

                // Ažuriranje statusa senzora
                senzor.Status = status;

                await baza.OcitanjaSenzora.AddAsync(ocitavanje);
                baza.Senzori.Update(senzor);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Očitanje registrovano",
                    Vrijednost = $"{vrijednost} {senzor.JedinicaMjere}",
                    Status = status.ToString(),
                    PorukaStatus = poruka,
                    Normalno = $"{senzor.PragNormalnoMin} - {senzor.PragNormalnoMax}",
                    Kritično = $"{senzor.PragCriticalMin} - {senzor.PragCriticalMax}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }
    }
}
