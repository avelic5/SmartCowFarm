using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using Backend.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ZadatakController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public ZadatakController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – svi zadaci
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<Zadatak>>> DajZadatke()
        {
            try
            {
                return Ok(await baza.Zadaci.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // HTTP GET – jedan zadatak po id
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<Zadatak>> DajZadatak(int id)
        {
            try
            {
                var trazeniZadatak = await baza.Zadaci.FindAsync(id);
                if (trazeniZadatak == null) return NotFound();

                return Ok(trazeniZadatak);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // POST – kreiranje zadatka
        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<Zadatak>> KreirajZadatak([FromBody] Zadatak noviZadatak)
        {
            try
            {
                if (noviZadatak == null)
                    return BadRequest();

                baza.Zadaci.Add(noviZadatak);
                await baza.SaveChangesAsync();

                // pretpostavka: primarni ključ je IdZadatka – promijeni ako je drugo ime
                return CreatedAtAction(nameof(DajZadatak),
                    new { id = noviZadatak.IdZadatka }, noviZadatak);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // PUT – update zadatka
        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult> UpdateZadatak(int id, [FromBody] Zadatak noviZadatak)
        {
            try
            {
                if (noviZadatak == null) return BadRequest();

                var trazeniZadatak = await baza.Zadaci.FindAsync(id);
                if (trazeniZadatak == null) return NotFound();

                baza.Entry(trazeniZadatak).CurrentValues.SetValues(noviZadatak);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // DELETE – brisanje zadatka
        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> ObrisiZadatak(int id)
        {
            try
            {
                var trazeniZadatak = await baza.Zadaci.FindAsync(id);
                if (trazeniZadatak == null) return NotFound();

                baza.Zadaci.Remove(trazeniZadatak);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // DODATNE FUNKCIONALNOSTI
        [HttpPut("{id}/zapocniZadatak")]
        //[Authorize]
        public async Task<IActionResult> ZapocniZadatak(int id)
        {
            try
            {
                var trazeniZadatak = await baza.Zadaci.FindAsync(id);
                if (trazeniZadatak == null) return NotFound(new { Poruka = "Trazeni zadatak nije pronaden" });

                // test status

                if (trazeniZadatak.StatusZadatka == Models.Enums.StatusZadatka.Obrada)
                {
                    return Conflict(new { Poruka = "Zadatak je vec u obadi" });
                }

                if (trazeniZadatak.StatusZadatka == Models.Enums.StatusZadatka.Zavrsen)
                {
                    return UnprocessableEntity(new { Poruka = "Zadatak je već završen" });
                }

                trazeniZadatak.StatusZadatka = Models.Enums.StatusZadatka.Obrada;
                trazeniZadatak.VrijemePocetka = DateTime.Now;


                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Zadatak je uspješno započet" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }

        }

        [HttpPut("{id}/zavrsiZadatak")]
        //[Authorize]
        public async Task<IActionResult> ZavrsiZadatak(int id)
        {
            try
            {
                var trazeniZadatak = await baza.Zadaci.FindAsync(id);
                if (trazeniZadatak == null)
                {
                    return NotFound(new { Poruka = "Trazeni zadatak nije pronaden" });
                }

                // provjera da je vec zavrsen

                if (trazeniZadatak.StatusZadatka == Models.Enums.StatusZadatka.Zavrsen)
                {
                    return UnprocessableEntity(new { Poruka = "Zadatak je vec zavrsen" });
                }

                if (trazeniZadatak.StatusZadatka == Models.Enums.StatusZadatka.Otkazan)
                {
                    return BadRequest(new { Poruka = "Zadatak je otkazan" });
                }

                if (trazeniZadatak.StatusZadatka == Models.Enums.StatusZadatka.Kreiran)
                {
                    return BadRequest(new { Poruka = "Zadatak je kreiran, a nije zapocet" });
                }


                trazeniZadatak.StatusZadatka = Models.Enums.StatusZadatka.Zavrsen;
                trazeniZadatak.VrijemeZavrsEtka = DateTime.Now;
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspjesan zavrsetak zadatka" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/promjeniPrioritet")]
        //[Authorize]
        public async Task<IActionResult> PromjeniPrioritet(int id, [FromBody] PromjeniPrioritetDto noviPrioritet)
        {
            try
            {
                if (noviPrioritet == null)
                {
                    return BadRequest(new { Poruka = "Polje prioritet je mandatorno" });
                }

                // provjera da li je u enumu
                if (!Enum.IsDefined(typeof(Prioritet), noviPrioritet.noviPrioritet))
                {
                    return BadRequest(new { Poruka = "Prioritet nije definisan, pogresan prioritet" });
                }

                var trazeniZadatak = await baza.Zadaci.FindAsync(id);

                if (trazeniZadatak == null)
                {
                    return NotFound(new { Poruka = "Trazeni zadatak ne postoji" });
                }

                if (trazeniZadatak.Prioritet == noviPrioritet.noviPrioritet)
                {
                    return Conflict(new { Poruka = $"Zadatak vec ima prioritet {trazeniZadatak.Prioritet}" });
                }


                trazeniZadatak.Prioritet = noviPrioritet.noviPrioritet;

                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Uspjesna promjena prioriteta" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajResurs")]
        //[Authorize]
        public async Task<IActionResult> DodajResurs(int id, [FromBody] TekstDto noviResurs)
        {
            try
            {
                if (noviResurs == null || string.IsNullOrWhiteSpace(noviResurs.tekst))
                {
                    return BadRequest(new { Poruka = "Tekst resursa ne smije biti prazan" });
                }


                var trazeniZadatak = await baza.Zadaci.FindAsync(id);

                if (trazeniZadatak == null)
                {
                    return NotFound(new { Poruka = "Trazeni zadatak ne postoji" });
                }



                if (string.IsNullOrWhiteSpace(trazeniZadatak.UtroseniResursiOpis))
                {

                    trazeniZadatak.UtroseniResursiOpis = noviResurs.tekst;
                }
                else
                {
                    // Dodaj na postojeću
                    trazeniZadatak.UtroseniResursiOpis += $"\n{noviResurs.tekst}";
                }

                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Uspjesno dodan resurs" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajKomentar")]
        //[Authorize]
        public async Task<IActionResult> DodajKomentar(int id, [FromBody] TekstDto noviKomentar)
        {
            try
            {
                if (noviKomentar == null || string.IsNullOrWhiteSpace(noviKomentar.tekst))
                {
                    return BadRequest(new { Poruka = "Polje tekst ne smije biti prazno" });
                }


                var trazeniZadatak = await baza.Zadaci.FindAsync(id);

                if (trazeniZadatak == null)
                {
                    return NotFound(new { Poruka = "Trazeni zadatak ne postoji" });
                }


                if (string.IsNullOrWhiteSpace(trazeniZadatak.UtroseniResursiOpis))
                {

                    trazeniZadatak.Napomene = noviKomentar.tekst;
                }
                else
                {
                    // Dodaj na postojeću
                    trazeniZadatak.Napomene += $"\n{noviKomentar.tekst}";
                }

                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Uspjesno dodan komentar" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }
    }
}


