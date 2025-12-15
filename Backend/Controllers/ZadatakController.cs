using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZadatakController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public ZadatakController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – svi zadaci
        [HttpGet]
        public async Task<ActionResult<List<Zadatak>>> DajZadatke()
        {
            return Ok(await baza.Zadaci.ToListAsync());
        }

        // HTTP GET – jedan zadatak po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Zadatak>> DajZadatak(int id)
        {
            var trazeniZadatak = await baza.Zadaci.FindAsync(id);
            if (trazeniZadatak == null) return NotFound();

            return Ok(trazeniZadatak);
        }

        // POST – kreiranje zadatka
        [HttpPost]
        public async Task<ActionResult<Zadatak>> KreirajZadatak([FromBody] Zadatak noviZadatak)
        {
            if (noviZadatak == null)
                return BadRequest();

            baza.Zadaci.Add(noviZadatak);
            await baza.SaveChangesAsync();

            // pretpostavka: primarni ključ je IdZadatka – promijeni ako je drugo ime
            return CreatedAtAction(nameof(DajZadatak),
                new { id = noviZadatak.IdZadatka }, noviZadatak);
        }

        // PUT – update zadatka
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateZadatak(int id, [FromBody] Zadatak noviZadatak)
        {
            if (noviZadatak == null) return BadRequest();

            var trazeniZadatak = await baza.Zadaci.FindAsync(id);
            if (trazeniZadatak == null) return NotFound();

            baza.Entry(trazeniZadatak).CurrentValues.SetValues(noviZadatak);
            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje zadatka
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiZadatak(int id)
        {
            var trazeniZadatak = await baza.Zadaci.FindAsync(id);
            if (trazeniZadatak == null) return NotFound();

            baza.Zadaci.Remove(trazeniZadatak);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
