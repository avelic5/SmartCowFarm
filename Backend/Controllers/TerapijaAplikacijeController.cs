using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class TerapijaAplikacijeController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public TerapijaAplikacijeController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – sve terapije aplikacije
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<TerapijaAplikacije>>> DajTerapijeAplikacije()
        {
            try
            {
                return Ok(await baza.TerapijeAplikacije.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // HTTP GET – jedna terapija aplikacije po id
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<TerapijaAplikacije>> DajTerapijuAplikacije(int id)
        {
            try
            {
                var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
                if (trazenaTerapijaAplikacije == null) return NotFound();

                return Ok(trazenaTerapijaAplikacije);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // POST – kreiranje terapije aplikacije
        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<TerapijaAplikacije>> KreirajTerapijuAplikacije(
            [FromBody] TerapijaAplikacije novaTerapijaAplikacije)
        {
            try
            {
                if (novaTerapijaAplikacije == null)
                    return BadRequest();

                baza.TerapijeAplikacije.Add(novaTerapijaAplikacije);
                await baza.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(DajTerapijuAplikacije),
                    new { id = novaTerapijaAplikacije.IdAplikacije },   // prilagodi nazivu ključa
                    novaTerapijaAplikacije
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // PUT – update terapije aplikacije
        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult> UpdateTerapijaAplikacije(
            int id,
            [FromBody] TerapijaAplikacije novaTerapijaAplikacije)
        {
            try
            {
                if (novaTerapijaAplikacije == null) return BadRequest();

                var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
                if (trazenaTerapijaAplikacije == null) return NotFound();

                baza.Entry(trazenaTerapijaAplikacije).CurrentValues.SetValues(novaTerapijaAplikacije);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // DELETE – brisanje terapije aplikacije
        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> ObrisiTerapijuAplikacije(int id)
        {
            try
            {
                var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
                if (trazenaTerapijaAplikacije == null) return NotFound();

                baza.TerapijeAplikacije.Remove(trazenaTerapijaAplikacije);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //DODATNE FUNKCIJE
        [HttpPut("{id}/primjeni")]
        //[Authorize]
        public async Task<IActionResult> Primjeni(int id, [FromBody] KolicinaDto novaKolicina)
        {
            try
            {

                if (novaKolicina == null)
                {
                    return BadRequest(new { Poruka = "Polje kolicina ne smije biti prazno" });
                }

                if (novaKolicina.kolicina <= 0)
                {
                    return BadRequest(new { Poruka = "Polje kolicina ne smije biti negativna" });
                }

                if (novaKolicina.kolicina > 1000)
                {
                    return BadRequest(new { Poruka = "Polje kolicina ne smije preci 1000" });
                }

                var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);

                if (trazenaTerapijaAplikacije == null)
                {
                    return NotFound(new { Poruka = "Trazena terapija aplikacije ne postoji" });
                }


                trazenaTerapijaAplikacije.PrimijenjenaKolicina += novaKolicina.kolicina;

                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Uspjesna izmenja kolicne" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/potvrdiIzvrsenje")]
        //[Authorize]
        public async Task<IActionResult> PotvrdiIzvrsenje(int id, [FromBody] IzvrsilacDto izvrsilac)
        {
            try
            {
                if (izvrsilac == null)
                {
                    return BadRequest(new { Poruka = "Polje izvrsilacID ne smije biti prazno" });
                }

                var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);

                if (trazenaTerapijaAplikacije == null)
                {
                    return NotFound(new { Poruka = "Trazena terapija aplikacije ne postoji" });
                }


                trazenaTerapijaAplikacije.IdIzvrsilac = izvrsilac.izvrsilacId;
                trazenaTerapijaAplikacije.DatumVrijeme = DateTime.Now;

                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspjesna potvrda izvrsenja terapije" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }
    }
}
