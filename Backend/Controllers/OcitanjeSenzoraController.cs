using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Enums;
using Backend.Controllers.Dtos;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcitanjeSenzoraController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public OcitanjeSenzoraController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }
        //HTTP BASIC
        [HttpGet]
        public async Task<ActionResult<List<OcitanjeSenzora>>> DajOcitanjaSenzora()
        {
            try
            {
                return Ok(await baza.OcitanjaSenzora.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<OcitanjeSenzora>> DajOcitanjeSenzora(int id)
        {
            try
            {
                var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);
                if (trazenoOcitanje == null) return NotFound();

                return Ok(trazenoOcitanje);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<OcitanjeSenzora>> KreirajOcitanjeSenzora([FromBody] OcitanjeSenzora novoOcitanje)
        {
            try
            {
                if (novoOcitanje == null)
                    return BadRequest();


                baza.OcitanjaSenzora.Add(novoOcitanje);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajOcitanjeSenzora), new { id = novoOcitanje.IdOcitanja }, novoOcitanje);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOcitanjeSenzora(int id, [FromBody] OcitanjeSenzora novoOcitanje)
        {
            try
            {
                if (novoOcitanje == null) return BadRequest();
                var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);

                if (trazenoOcitanje == null) return NotFound();

                //kraci nacin za mijenjane vrijednosti u varijablama
                baza.Entry(trazenoOcitanje).CurrentValues.SetValues(novoOcitanje);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiOcitanjeSenzora(int id)
        {
            try
            {
                var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);
                if (trazenoOcitanje == null) return NotFound();

                baza.OcitanjaSenzora.Remove(trazenoOcitanje);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/oznaciStatus")]
        public async Task<IActionResult> OznaciStatus(int id, [FromBody] StatusDto noviStatus)
        {
            try
            {
                if (noviStatus == null)
                {
                    return BadRequest(new { Poruka = "Status polje je obavezno" });
                }

                if (!Enum.IsDefined(typeof(StatusOcitavanja), noviStatus.noviStatus))
                {
                    return BadRequest(new { Poruka = "Status polje nije medu datim statusima" });
                }


                var trazenoOcitanjeSenzora = await baza.OcitanjaSenzora.FindAsync(id);

                if (trazenoOcitanjeSenzora == null)
                {
                    return NotFound(new { Poruka = "Dato ocitanje statusa nije pronadeno" });
                }

                trazenoOcitanjeSenzora.StatusOcitanja = noviStatus.noviStatus.Value;

                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspjesna izmjena statusa Ocitanja" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajNapomenu")]
        public async Task<IActionResult> DodajNapomenu(int id, [FromBody] TekstDto novaNapomena)
        {
            try
            {
                if (novaNapomena == null || string.IsNullOrWhiteSpace(novaNapomena.tekst))
                {
                    return BadRequest(new { Poruka = "Napomena polje je obavezno" });
                }


                var trazenoOcitanjeSenzora = await baza.OcitanjaSenzora.FindAsync(id);

                if (trazenoOcitanjeSenzora == null)
                {
                    return NotFound(new { Poruka = "Dato ocitanje statusa nije pronadeno" });
                }

                if (string.IsNullOrWhiteSpace(trazenoOcitanjeSenzora.Napomena))
                {

                    trazenoOcitanjeSenzora.Napomena = novaNapomena.tekst;
                }
                else
                {
                    // Dodaj na postojeću
                    trazenoOcitanjeSenzora.Napomena += $"\n{novaNapomena.tekst}";
                }

                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspjesna izmjena statusa Ocitanja" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }
    }
}