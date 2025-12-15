using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpozorenjeController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public UpozorenjeController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        // HTTP GET – sva upozorenja
        [HttpGet]
        public async Task<ActionResult<List<Upozorenje>>> DajUpozorenja()
        {
            return Ok(await baza.Upozorenja.ToListAsync());
        }

        // HTTP GET – jedno upozorenje po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Upozorenje>> DajUpozorenje(int id)
        {
            var trazenoUpozorenje = await baza.Upozorenja.FindAsync(id);
            if (trazenoUpozorenje == null) return NotFound();

            return Ok(trazenoUpozorenje);
        }

        // POST – kreiranje upozorenja
        [HttpPost]
        public async Task<ActionResult<Upozorenje>> KreirajUpozorenje([FromBody] Upozorenje novoUpozorenje)
        {
            if (novoUpozorenje == null)
                return BadRequest();

            baza.Upozorenja.Add(novoUpozorenje);
            await baza.SaveChangesAsync();

            // pretpostavka da je ključ IdUpozorenja – promijeni ako se drugačije zove
            return CreatedAtAction(nameof(DajUpozorenje),
                new { id = novoUpozorenje.IdUpozorenja }, novoUpozorenje);
        }

        // PUT – update upozorenja
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUpozorenje(int id, [FromBody] Upozorenje novoUpozorenje)
        {
            if (novoUpozorenje == null) return BadRequest();

            var trazenoUpozorenje = await baza.Upozorenja.FindAsync(id);
            if (trazenoUpozorenje == null) return NotFound();

            baza.Entry(trazenoUpozorenje).CurrentValues.SetValues(novoUpozorenje);
            await baza.SaveChangesAsync();

            return NoContent();
        }

        // DELETE – brisanje upozorenja
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiUpozorenje(int id)
        {
            var trazenoUpozorenje = await baza.Upozorenja.FindAsync(id);
            if (trazenoUpozorenje == null) return NotFound();

            baza.Upozorenja.Remove(trazenoUpozorenje);
            await baza.SaveChangesAsync();

            return NoContent();
        }

    }
}
