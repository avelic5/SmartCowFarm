using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MuzaController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public MuzaController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }
        //HTTP BASIC
        [HttpGet]
        public async Task<ActionResult<List<Muza>>> DajMuze()
        {
            return Ok(await baza.Muze.ToListAsync());
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Muza>> DajMuzu(int id)
        {
            var trazenaMuza = await baza.Muze.FindAsync(id);
            if (trazenaMuza == null)
            {
                return NotFound();
            }

            return Ok(trazenaMuza);
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<Muza>> KreirajMuzu([FromBody] Muza novaMuza)
        {
            if(novaMuza == null)
                return BadRequest();
            

            baza.Muze.Add(novaMuza);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajMuzu), new {id = novaMuza.IdMuze}, novaMuza);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateMuzu(int id, [FromBody] Muza novaMuza)
        {
            if(novaMuza==null)return BadRequest();
            var trazenaMuza = await baza.Muze.FindAsync(id);
            
            if(trazenaMuza==null) return NotFound();

            //kraci nacin za mijenjane vrijednosti u varijablama
            baza.Entry(trazenaMuza).CurrentValues.SetValues(novaMuza); 

            await baza.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiMuzu(int id)
        {
            var trazenaMuza = await baza.Muze.FindAsync(id);
            if(trazenaMuza==null)return NotFound();

            baza.Muze.Remove(trazenaMuza);
            await baza.SaveChangesAsync();

            return NoContent();
        }
    }
}
