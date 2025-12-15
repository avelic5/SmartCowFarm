using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerapijaAplikacijeController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public TerapijaAplikacijeController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – sve terapije aplikacije
        [HttpGet]
        public async Task<ActionResult<List<TerapijaAplikacije>>> DajTerapijeAplikacije()
        {
            return Ok(await baza.TerapijeAplikacije.ToListAsync());
        }

        // HTTP GET – jedna terapija aplikacije po id
        [HttpGet("{id}")]
        public async Task<ActionResult<TerapijaAplikacije>> DajTerapijuAplikacije(int id)
        {
            var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
            if (trazenaTerapijaAplikacije == null) return NotFound();

            return Ok(trazenaTerapijaAplikacije);
        }

        // POST – kreiranje terapije aplikacije
        [HttpPost]
        public async Task<ActionResult<TerapijaAplikacije>> KreirajTerapijuAplikacije(
            [FromBody] TerapijaAplikacije novaTerapijaAplikacije)
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

        // PUT – update terapije aplikacije
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTerapijaAplikacije(
            int id,
            [FromBody] TerapijaAplikacije novaTerapijaAplikacije)
        {
            if (novaTerapijaAplikacije == null) return BadRequest();

            var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
            if (trazenaTerapijaAplikacije == null) return NotFound();

            baza.Entry(trazenaTerapijaAplikacije).CurrentValues.SetValues(novaTerapijaAplikacije);
            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje terapije aplikacije
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiTerapijuAplikacije(int id)
        {
            var trazenaTerapijaAplikacije = await baza.TerapijeAplikacije.FindAsync(id);
            if (trazenaTerapijaAplikacije == null) return NotFound();

            baza.TerapijeAplikacije.Remove(trazenaTerapijaAplikacije);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
