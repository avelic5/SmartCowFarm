using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public KorisnikController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }
        //HTTP BASIC
        [HttpGet]
        public async Task<ActionResult<List<Korisnik>>> DajKorisnike()
        {
            return Ok(await baza.Korisnici.ToListAsync());
        }

        //HTTP DAJ KORISNIKA PO IDU
        [HttpGet("{id}")]
        public async Task<ActionResult<Korisnik>> DajKorisnika(int id)
        {
            var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
            if (trazeniKorisnik == null)
            {
                return NotFound();
            }

            return Ok(trazeniKorisnik);
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<Korisnik>> KreirajKorisnika([FromBody] Korisnik noviKorisnik)
        {
            if(noviKorisnik == null)
                return BadRequest();
            

            baza.Korisnici.Add(noviKorisnik);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajKorisnika), new {id = noviKorisnik.IdKorisnika}, noviKorisnik);
        }
    }
}
