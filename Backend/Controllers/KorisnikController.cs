using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly IPasswordHasher<Korisnik> passwordHasher;
        private readonly SmartCowFarmDatabaseContext baza;
        public KorisnikController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
            passwordHasher = new PasswordHasher<Korisnik>();
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

            noviKorisnik.HashLozinke=passwordHasher.HashPassword(noviKorisnik,noviKorisnik.HashLozinke);
            baza.Korisnici.Add(noviKorisnik);
            await baza.SaveChangesAsync();

            return CreatedAtAction(nameof(DajKorisnika), new {id = noviKorisnik.IdKorisnika}, noviKorisnik);
        }

        //HTTP PUT PO IDU I IZMJENI KORISNIKA
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKorisnika(int id, [FromBody] Korisnik noviKorisnik)
        {
            if(noviKorisnik==null)return BadRequest();
            var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
            
            if(trazeniKorisnik==null) return NotFound();

            if (!string.IsNullOrWhiteSpace(noviKorisnik.HashLozinke))
            {
                trazeniKorisnik.HashLozinke= passwordHasher.HashPassword(noviKorisnik, noviKorisnik.HashLozinke);
            }
            
            //kraci nacin za mijenjane vrijednosti u varijablama
            baza.Entry(trazeniKorisnik).CurrentValues.SetValues(noviKorisnik); 

            await baza.SaveChangesAsync();

            return NoContent();
        }

        //HTTP DELETE KORISNIKA PO ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiKorisnika(int id)
        {
            var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
            if(trazeniKorisnik==null)return NotFound();

            baza.Korisnici.Remove(trazeniKorisnik);
            await baza.SaveChangesAsync();

            return NoContent();
        }

        /*
        // DODATNE FUNKCIONALNOSTI
        [HttpPost("{id}/autentifikuj")]
        public async Task<IActionResult> Autentifikuj(int id, [FromBody] Korisnik korisnikZaAutentifikaciju)
        {
            var korisnikIzBaze = baza.Korisnici.FindAsync(id);
            if(korisnikIzBaze == null || korisnikIzBaze.Status != "Aktivan")
        }
        */
    }
}
