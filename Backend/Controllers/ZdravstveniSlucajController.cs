using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ZdravstveniSlucajController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public ZdravstveniSlucajController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – svi zdravstveni slučajevi
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<ZdravstveniSlucaj>>> DajZdravstveneSlucajeve()
        {
            try
            {
                return Ok(await baza.ZdravstveniSlucajevi.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // HTTP GET – jedan zdravstveni slučaj po id
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<ZdravstveniSlucaj>> DajZdravstveniSlucaj(int id)
        {
            try
            {
                var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
                if (trazeniSlucaj == null) return NotFound();

                return Ok(trazeniSlucaj);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // POST – kreiranje zdravstvenog slučaja
        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<ZdravstveniSlucaj>> KreirajZdravstveniSlucaj(
            [FromBody] ZdravstveniSlucaj noviSlucaj)
        {
            try
            {
                if (noviSlucaj == null)
                    return BadRequest();

                baza.ZdravstveniSlucajevi.Add(noviSlucaj);
                await baza.SaveChangesAsync();

                // pretpostavka: primarni ključ je IdZdravstvenogSlucaja – promijeni ako se drugačije zove
                return CreatedAtAction(nameof(DajZdravstveniSlucaj),
                    new { id = noviSlucaj.IdSlucaja }, noviSlucaj);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // PUT – update zdravstvenog slučaja
        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult> UpdateZdravstveniSlucaj(
            int id,
            [FromBody] ZdravstveniSlucaj noviSlucaj)
        {
            try
            {
                if (noviSlucaj == null) return BadRequest();

                var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
                if (trazeniSlucaj == null) return NotFound();

                baza.Entry(trazeniSlucaj).CurrentValues.SetValues(noviSlucaj);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // DELETE – brisanje zdravstvenog slučaja
        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> ObrisiZdravstveniSlucaj(int id)
        {
            try
            {
                var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
                if (trazeniSlucaj == null) return NotFound();

                baza.ZdravstveniSlucajevi.Remove(trazeniSlucaj);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }
        // DODATNE FUNCKIONALNOSTI

        [HttpPut("{id}/otvoriSlucaj")]
        //[Authorize]
        public async Task<IActionResult> OtvoriSlucaj(int id, [FromBody] ZdravstveniSlucajDto noviZdravstveniSlucaj)
        {
            try
            {
                if (noviZdravstveniSlucaj == null)
                {
                    return BadRequest(new { Poruka = "Data polja su obavezna" });
                }

                if (string.IsNullOrWhiteSpace(noviZdravstveniSlucaj.opisSimptoma))
                {
                    return BadRequest(new { Poruka = "Opis simptoma je obavezan" });
                }


                var trazenaKrava = await baza.Krave.FindAsync(noviZdravstveniSlucaj.idKrave);

                if (trazenaKrava == null)
                {
                    return NotFound(new { Poruka = "Nema trazene krave u bazi" });
                }

                // Provjera statusa krave
                if (trazenaKrava.TrenutniStatus == Models.Enums.StatusZdravlja.Prodana)
                {
                    return BadRequest(new { Poruka = "Ne možete otvoriti slučaj za prodanu kravu" });
                }

                if (trazenaKrava.TrenutniStatus == Models.Enums.StatusZdravlja.Neaktivna)
                {
                    return BadRequest(new { Poruka = "Ne možete otvoriti slučaj za neaktivnu kravu" });
                }

                // Provjera da li već postoji aktivan slučaj
                var aktivanSlucaj = await baza.ZdravstveniSlucajevi
                    .Where(z => z.IdKrave == noviZdravstveniSlucaj.idKrave
                        && z.StatusSlucaja != Models.Enums.StatusZdravlja.Prodana
                        && z.StatusSlucaja != Models.Enums.StatusZdravlja.Aktivna)
                    .FirstOrDefaultAsync();

                if (aktivanSlucaj != null)
                {
                    return Conflict(new
                    {
                        Poruka = "Već postoji aktivan zdravstveni slučaj za ovu kravu"
                    });
                }

                // Kreiranje novog zdravstvenog slučaja
                var noviSlucaj = new ZdravstveniSlucaj
                {
                    IdKrave = noviZdravstveniSlucaj.idKrave,
                    DatumOtvaranja = DateOnly.FromDateTime(DateTime.Now),
                    VrijemeOtvaranja = TimeOnly.FromDateTime(DateTime.Now),
                    RazlogOtvaranja = noviZdravstveniSlucaj.razlogOtvaranja,
                    OpisSimptoma = noviZdravstveniSlucaj.opisSimptoma,
                    StatusSlucaja = Models.Enums.StatusZdravlja.Aktivna, // Početni status
                    IdVeterinara = noviZdravstveniSlucaj.idVeterinara,
                    Napomene = noviZdravstveniSlucaj.Napomene
                };

                // Ažuriranje statusa krave
                trazenaKrava.TrenutniStatus = Models.Enums.StatusZdravlja.Aktivna;

                await baza.ZdravstveniSlucajevi.AddAsync(noviSlucaj);
                baza.Krave.Update(trazenaKrava);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Zdravstveni slučaj uspješno otvoren",
                    Id = noviSlucaj.IdKrave
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/zatvoriSlucaj")]
        //[Authorize]
        public async Task<IActionResult> ZatvoriSlucaj(int id, [FromBody] ZatvoriSlucajDto zatvoriDto)
        {
            try
            {
                var slucaj = await baza.ZdravstveniSlucajevi
                    .Include(z => z.Krava)
                    .FirstOrDefaultAsync(z => z.IdSlucaja == id);

                if (slucaj == null)
                {
                    return NotFound(new { Poruka = "Zdravstveni slučaj nije pronađen" });
                }

                if (slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Neaktivna || slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Prodana)
                {
                    return BadRequest(new { Poruka = "Slucaj je već zatvoren ili otkazan" });
                }

                // Ažuriranje slučaja
                slucaj.StatusSlucaja = Models.Enums.StatusZdravlja.Neaktivna;
                slucaj.DatumZatvaranja = DateOnly.FromDateTime(DateTime.Now);
                slucaj.Dijagnoza = zatvoriDto.Dijagnoza;

                if (!string.IsNullOrWhiteSpace(zatvoriDto.Napomena))
                {
                    slucaj.Napomene += (string.IsNullOrEmpty(slucaj.Napomene) ? "" : "\n") +
                                $"Zatvaranje: {zatvoriDto.Napomena}";
                }

                // Ažuriranje statusa krave na AKTIVAN
                if (slucaj.Krava != null)
                {
                    slucaj.Krava.TrenutniStatus = Models.Enums.StatusZdravlja.Aktivna;
                    baza.Krave.Update(slucaj.Krava);
                }

                baza.ZdravstveniSlucajevi.Update(slucaj);
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Zdravstveni slučaj uspješno zatvoren" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajSimptom")]
        //[Authorize]
        public async Task<IActionResult> DodajSimptom(int id, [FromBody] DodajSimptomDto simptomDto)
        {
            try
            {
                var slucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);

                if (slucaj == null)
                {
                    return NotFound(new { Poruka = "Zdravstveni slučaj nije pronađen" });
                }

                if (slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Neaktivna || slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Prodana)
                {
                    return BadRequest(new { Poruka = "Ne možete dodati simptom zatvorenom slučaju" });
                }

                if (string.IsNullOrWhiteSpace(simptomDto.Simptom))
                {
                    return BadRequest(new { Poruka = "Opis simptoma je obavezan" });
                }

                // Dodavanje novog simptoma u postojeći opis
                var timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm");
                var noviSimptom = $"\n[{timestamp}] {simptomDto.Simptom}";

                slucaj.OpisSimptoma += noviSimptom;

                // Ažuriranje tipa anomalije ako je unesen
                if (!string.IsNullOrWhiteSpace(simptomDto.TipAnomalije))
                {
                    slucaj.AiTipAnomalije = simptomDto.TipAnomalije;
                }

                baza.ZdravstveniSlucajevi.Update(slucaj);
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Simptom uspješno dodan", NoviOpis = slucaj.OpisSimptoma });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajTerapiju")]
        //[Authorize]
        public async Task<IActionResult> DodajTerapiju(int id, [FromBody] DodajTerapijuDto terapijaDto)
        {
            try
            {
                var slucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);

                if (slucaj == null)
                {
                    return NotFound(new { Poruka = "Zdravstveni slučaj nije pronađen" });
                }

                if (slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Prodana || slucaj.StatusSlucaja == Models.Enums.StatusZdravlja.Neaktivna)
                {
                    return BadRequest(new { Poruka = "Ne možete dodati terapiju zatvorenom slučaju" });
                }

                // Validacija podataka terapije
                if (terapijaDto.IdTerapije <= 0)
                {
                    return BadRequest(new { Poruka = "ID terapije je obavezan" });
                }

                // Provjera da li terapija postoji
                var terapija = await baza.Terapije.FindAsync(terapijaDto.IdTerapije);
                if (terapija == null)
                {
                    return NotFound(new { Poruka = "Terapija nije pronađena" });
                }

                // Kreiranje terapijske aplikacije
                var terapijaAplikacija = new TerapijaAplikacije
                {
                    IdTerapije = terapijaDto.IdTerapije,
                    IdAplikacije = id,
                    DatumVrijeme = DateTime.Now,
                    IdIzvrsilac = terapijaDto.IdIzvrsioca,
                    Napomena = terapijaDto.Napomena
                };

                // Ažuriranje slučaja ako treba
                if (!string.IsNullOrWhiteSpace(terapijaDto.Napomena))
                {
                    slucaj.Napomene += (string.IsNullOrEmpty(slucaj.Napomene) ? "" : "\n") +
                                    $"Terapija dodana: {terapijaDto.Napomena}";
                    baza.ZdravstveniSlucajevi.Update(slucaj);
                }

                await baza.TerapijeAplikacije.AddAsync(terapijaAplikacija);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Terapija uspješno dodana slučaju",
                    IdAplikacije = terapijaAplikacija.IdAplikacije
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajNapomenu")]
        //[Authorize]
        public async Task<IActionResult> DodajNapomenu(int id, [FromBody] TekstDto napomenaDto)
        {
            try
            {
                var slucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);

                if (slucaj == null)
                {
                    return NotFound(new { Poruka = "Zdravstveni slučaj nije pronađen" });
                }

                if (string.IsNullOrWhiteSpace(napomenaDto.tekst))
                {
                    return BadRequest(new { Poruka = "Tekst napomene je obavezan" });
                }

                var timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm");
                var formatiranaNapomena = $"\n[{timestamp}] {napomenaDto.tekst}";

                // Dodavanje napomene
                slucaj.Napomene += (string.IsNullOrEmpty(slucaj.Napomene) ? "" : formatiranaNapomena);

                baza.ZdravstveniSlucajevi.Update(slucaj);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Napomena uspješno dodana",
                    UkupneNapomene = slucaj.Napomene
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }
    }
}
