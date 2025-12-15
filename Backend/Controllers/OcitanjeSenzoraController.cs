using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            return Ok(await baza.OcitanjaSenzora.ToListAsync());
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<OcitanjeSenzora>> DajOcitanjeSenzora(int id)
        {
            var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);
            if (trazenoOcitanje == null)return NotFound();
            
            return Ok(trazenoOcitanje);
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<OcitanjeSenzora>> KreirajOcitanjeSenzora([FromBody] OcitanjeSenzora novoOcitanje)
        {
            if(novoOcitanje == null)
                return BadRequest();
            

            baza.OcitanjaSenzora.Add(novoOcitanje);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajOcitanjeSenzora), new {id = novoOcitanje.IdOcitanja}, novoOcitanje);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOcitanjeSenzora(int id, [FromBody] OcitanjeSenzora novoOcitanje)
        {
            if(novoOcitanje==null)return BadRequest();
            var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);
            
            if(trazenoOcitanje==null) return NotFound();

            //kraci nacin za mijenjane vrijednosti u varijablama
            baza.Entry(trazenoOcitanje).CurrentValues.SetValues(novoOcitanje); 

            await baza.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiOcitanjeSenzora(int id)
        {
            var trazenoOcitanje = await baza.OcitanjaSenzora.FindAsync(id);
            if(trazenoOcitanje==null)return NotFound();

            baza.OcitanjaSenzora.Remove(trazenoOcitanje);
            await baza.SaveChangesAsync();

            return NoContent();
        }
    }
}
