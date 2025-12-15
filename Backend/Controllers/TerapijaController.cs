using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerapijaController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public TerapijaController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – sve terapije
        [HttpGet]
        public async Task<ActionResult<List<Terapija>>> DajTerapije()
        {
            return Ok(await baza.Terapije.ToListAsync());
        }

        // HTTP GET – jedna terapija po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Terapija>> DajTerapiju(int id)
        {
            var trazenaTerapija = await baza.Terapije.FindAsync(id);
            if (trazenaTerapija == null) return NotFound();

            return Ok(trazenaTerapija);
        }

        // POST – kreiranje terapije
        [HttpPost]
        public async Task<ActionResult<Terapija>> KreirajTerapiju([FromBody] Terapija novaTerapija)
        {
            if (novaTerapija == null)
                return BadRequest();

            baza.Terapije.Add(novaTerapija);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajTerapiju), new { id = novaTerapija.IdTerapije }, novaTerapija);
        }

        // PUT – update terapije
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTerapija(int id, [FromBody] Terapija novaTerapija)
        {
            if (novaTerapija == null) return BadRequest();

            var trazenaTerapija = await baza.Terapije.FindAsync(id);
            if (trazenaTerapija == null) return NotFound();

            baza.Entry(trazenaTerapija).CurrentValues.SetValues(novaTerapija);

            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje terapije
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiTerapiju(int id)
        {
            var trazenaTerapija = await baza.Terapije.FindAsync(id);
            if (trazenaTerapija == null) return NotFound();

            baza.Terapije.Remove(trazenaTerapija);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
