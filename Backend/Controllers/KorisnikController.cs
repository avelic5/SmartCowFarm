using Backend.Controllers.Dtos;
using Backend.Data;
using Backend.Models;
using Backend.Models.Enums;
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
            try
            {
                return Ok(await baza.Korisnici.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //HTTP DAJ KORISNIKA PO IDU
        [HttpGet("{id}")]
        public async Task<ActionResult<Korisnik>> DajKorisnika(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                {
                    return NotFound();
                }

                return Ok(trazeniKorisnik);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<Korisnik>> KreirajKorisnika([FromBody] Korisnik noviKorisnik)
        {
            if (noviKorisnik == null)
                return BadRequest();

            noviKorisnik.HashLozinke = passwordHasher.HashPassword(noviKorisnik, noviKorisnik.HashLozinke);
            try
            {
                baza.Korisnici.Add(noviKorisnik);
                await baza.SaveChangesAsync();
                return CreatedAtAction(nameof(DajKorisnika), new { id = noviKorisnik.IdKorisnika }, noviKorisnik);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }

        }

        //HTTP PUT PO IDU I IZMJENI KORISNIKA
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKorisnika(int id, [FromBody] Korisnik noviKorisnik)
        {
            try
            {
                if (noviKorisnik == null) return BadRequest();
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);

                if (trazeniKorisnik == null) return NotFound();

                if (!string.IsNullOrWhiteSpace(noviKorisnik.HashLozinke))
                {
                    trazeniKorisnik.HashLozinke = passwordHasher.HashPassword(noviKorisnik, noviKorisnik.HashLozinke);
                }

                //kraci nacin za mijenjane vrijednosti u varijablama
                baza.Entry(trazeniKorisnik).CurrentValues.SetValues(noviKorisnik);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        //HTTP DELETE KORISNIKA PO ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiKorisnika(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null) return NotFound();

                baza.Korisnici.Remove(trazeniKorisnik);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }


        // DODATNE FUNKCIONALNOSTI
        [HttpPost("autentifikuj")]
        public async Task<IActionResult> Autentifikuj([FromBody] AutentifikacijaDto korisnikZaAutentifikaciju)
        {
            try
            {

                if (string.IsNullOrEmpty(korisnikZaAutentifikaciju.Email) &&
                    string.IsNullOrEmpty(korisnikZaAutentifikaciju.KorisnickoIme))
                {
                    return BadRequest(new { Poruka = "Email ili korisničko ime je obavezno" });
                }

                Korisnik? korisnikIzBaze = null;


                if (!string.IsNullOrEmpty(korisnikZaAutentifikaciju.KorisnickoIme))
                {
                    korisnikIzBaze = await baza.Korisnici
                        .FirstOrDefaultAsync(k => k.KorisnickoIme == korisnikZaAutentifikaciju.KorisnickoIme);
                }


                if (korisnikIzBaze == null && !string.IsNullOrEmpty(korisnikZaAutentifikaciju.Email))
                {
                    korisnikIzBaze = await baza.Korisnici
                        .FirstOrDefaultAsync(k => k.Email == korisnikZaAutentifikaciju.Email);
                }

                if (korisnikIzBaze == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronađen" });
                }

                if (korisnikIzBaze.StatusNaloga != StatusNaloga.Aktivan)
                {
                    return Unauthorized(new { Poruka = "Korisnički račun nije aktivan" });
                }

                var odgovorHasiranja = passwordHasher.VerifyHashedPassword(korisnikIzBaze, korisnikIzBaze.HashLozinke, korisnikZaAutentifikaciju.Lozinka);


                if (odgovorHasiranja == PasswordVerificationResult.Success)
                {
                    return Ok(new
                    {
                        Poruka = "Autentifikacija uspješna",
                        IdKorisnika = korisnikIzBaze.IdKorisnika,
                        Ime = korisnikIzBaze.Ime,
                        Prezime = korisnikIzBaze.Prezime,
                        Email = korisnikIzBaze.Email,
                        KorisnickoIme = korisnikIzBaze.KorisnickoIme,
                        StatusNaloga = korisnikIzBaze.StatusNaloga,
                        Telefon = korisnikIzBaze.Telefon,
                        RadnoMjesto = korisnikIzBaze.RadnoMjesto,
                        DatumZaposljenja = korisnikIzBaze.DatumZaposlenja,
                        Odjel = korisnikIzBaze.Odjel,
                        Napomene = korisnikIzBaze.Napomene
                    });
                }

                return Unauthorized("Pogrešna lozinka");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/promjeniLozinku")]
        public async Task<IActionResult> PromjeniLozinku(int id, [FromBody] PromjenaLozinkeDto NovaLozinka)
        {
            try
            {
                if (NovaLozinka == null || string.IsNullOrEmpty(NovaLozinka.NovaLozinka))
                {
                    return BadRequest(new { Poruka = "Nova lozinka je obavezna" });
                }

                var korisnikIzBaze = await baza.Korisnici.FindAsync(id);
                if (korisnikIzBaze == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronaden" });
                }
                korisnikIzBaze.HashLozinke = passwordHasher.HashPassword(korisnikIzBaze, NovaLozinka.NovaLozinka);
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno izmjenjena lozinka" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/azurirajKontakt")]
        public async Task<IActionResult> AzurirajKontakt(int id, [FromBody] AzurirajKontaktDto noviKontakti)
        {
            try
            {
                if (noviKontakti == null)
                {
                    return BadRequest(new { Poruka = "Novi kontakti su obavezna" });
                }

                var korisnikIzBaze = await baza.Korisnici.FindAsync(id);
                if (korisnikIzBaze == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronaden" });
                }
                korisnikIzBaze.Email = noviKontakti.Email;
                korisnikIzBaze.Telefon = noviKontakti.Telefon;
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno izmjenjena kontakata" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/deaktivirajNalog")]
        public async Task<ActionResult<Korisnik>> deaktivirajNalog(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                {
                    return NotFound();
                }

                trazeniKorisnik.StatusNaloga = StatusNaloga.Neaktivan;
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno izmjenjena statusa naloga" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

    }
}