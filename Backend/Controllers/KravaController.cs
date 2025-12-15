using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KravaController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public KravaController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }
        //HTTP BASIC
        [HttpGet]
        public async Task<ActionResult<List<Krava>>> DajKrave()
        {
            return Ok(await baza.Krave.ToListAsync());
        }

        //HTTP DAJ KRAVU PO IDU
        [HttpGet("{id}")]
        public async Task<ActionResult<Krava>> DajKravu(int id)
        {
            var trazenaKrava = await baza.Krave.FindAsync(id);
            if (trazenaKrava == null)
            {
                return NotFound();
            }

            return Ok(trazenaKrava);
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<Krava>> KreirajKravu([FromBody] Krava novaKrava)
        {
            if (novaKrava == null)
                return BadRequest();


            baza.Krave.Add(novaKrava);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajKravu), new { id = novaKrava.IdKrave }, novaKrava);
        }

        //HTTP PUT PO IDU I IZMJENI KRAVU
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKravu(int id, [FromBody] Krava novaKrava)
        {
            if (novaKrava == null) return BadRequest();
            var trazenaKrava = await baza.Krave.FindAsync(id);

            if (trazenaKrava == null) return NotFound();

            //kraci nacin za mijenjane vrijednosti u varijablama
            baza.Entry(trazenaKrava).CurrentValues.SetValues(novaKrava);

            await baza.SaveChangesAsync();

            return NoContent();
        }

        //HTTP DELETE kravu PO ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiKravu(int id)
        {
            var trazenaKrava = await baza.Krave.FindAsync(id);
            if (trazenaKrava == null) return NotFound();

            baza.Krave.Remove(trazenaKrava);
            await baza.SaveChangesAsync();

            return NoContent();
        }
    }
}
