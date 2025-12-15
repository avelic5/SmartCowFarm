using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZdravstveniSlucajController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public ZdravstveniSlucajController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – svi zdravstveni slučajevi
        [HttpGet]
        public async Task<ActionResult<List<ZdravstveniSlucaj>>> DajZdravstveneSlucajeve()
        {
            return Ok(await baza.ZdravstveniSlucajevi.ToListAsync());
        }

        // HTTP GET – jedan zdravstveni slučaj po id
        [HttpGet("{id}")]
        public async Task<ActionResult<ZdravstveniSlucaj>> DajZdravstveniSlucaj(int id)
        {
            var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
            if (trazeniSlucaj == null) return NotFound();

            return Ok(trazeniSlucaj);
        }

        // POST – kreiranje zdravstvenog slučaja
        [HttpPost]
        public async Task<ActionResult<ZdravstveniSlucaj>> KreirajZdravstveniSlucaj(
            [FromBody] ZdravstveniSlucaj noviSlucaj)
        {
            if (noviSlucaj == null)
                return BadRequest();

            baza.ZdravstveniSlucajevi.Add(noviSlucaj);
            await baza.SaveChangesAsync();

            // pretpostavka: primarni ključ je IdZdravstvenogSlucaja – promijeni ako se drugačije zove
            return CreatedAtAction(nameof(DajZdravstveniSlucaj),
                new { id = noviSlucaj.IdSlucaja }, noviSlucaj);
        }

        // PUT – update zdravstvenog slučaja
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateZdravstveniSlucaj(
            int id,
            [FromBody] ZdravstveniSlucaj noviSlucaj)
        {
            if (noviSlucaj == null) return BadRequest();

            var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
            if (trazeniSlucaj == null) return NotFound();

            baza.Entry(trazeniSlucaj).CurrentValues.SetValues(noviSlucaj);
            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje zdravstvenog slučaja
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiZdravstveniSlucaj(int id)
        {
            var trazeniSlucaj = await baza.ZdravstveniSlucajevi.FindAsync(id);
            if (trazeniSlucaj == null) return NotFound();

            baza.ZdravstveniSlucajevi.Remove(trazeniSlucaj);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
