using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            return Ok(await baza.Senzori.ToListAsync());
        }

        // HTTP GET – jedan senzor po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Senzor>> DajSenzor(int id)
        {
            var trazeniSenzor = await baza.Senzori.FindAsync(id);
            if (trazeniSenzor == null) return NotFound();

            return Ok(trazeniSenzor);
        }

        // POST – kreiranje senzora
        [HttpPost]
        public async Task<ActionResult<Senzor>> KreirajSenzor([FromBody] Senzor noviSenzor)
        {
            if (noviSenzor == null)
                return BadRequest();

            baza.Senzori.Add(noviSenzor);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajSenzor), new { id = noviSenzor.IdSenzora }, noviSenzor);
        }

        // PUT – update senzora
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSenzor(int id, [FromBody] Senzor noviSenzor)
        {
            if (noviSenzor == null) return BadRequest();

            var trazeniSenzor = await baza.Senzori.FindAsync(id);
            if (trazeniSenzor == null) return NotFound();

            baza.Entry(trazeniSenzor).CurrentValues.SetValues(noviSenzor);

            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje senzora
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiSenzor(int id)
        {
            var trazeniSenzor = await baza.Senzori.FindAsync(id);
            if (trazeniSenzor == null) return NotFound();

            baza.Senzori.Remove(trazeniSenzor);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
