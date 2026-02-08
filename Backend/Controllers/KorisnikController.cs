using Backend.Controllers.Dtos;
using Backend.Data;
using Backend.Models;
using Backend.Models.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly IPasswordHasher<Korisnik> passwordHasher;
        private readonly SmartCowFarmDatabaseContext baza;
        private readonly IJwtServis jwtServis;

        public KorisnikController(
            SmartCowFarmDatabaseContext _context,
            IPasswordHasher<Korisnik> _passwordHasher,
            IJwtServis _jwtServis)
        {
            baza = _context;
            passwordHasher = _passwordHasher;
            jwtServis = _jwtServis;
        }

        [HttpGet]
        [Authorize(Roles = nameof(RadnoMjesto.Admin))]
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

        //[Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Korisnik>> DajKorisnika(int id)
        {
            try
            {
                var trenutniKorisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var uloga = User.FindFirstValue(ClaimTypes.Role);

                if (uloga != nameof(RadnoMjesto.Admin) &&
                    (!int.TryParse(trenutniKorisnikId, out int trenutniId) || trenutniId != id))
                {
                    return Forbid(); 
                }

                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronadjen" });
                }

                return Ok(trazeniKorisnik);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPost]
        //[Authorize(Roles = nameof(RadnoMjesto.Admin))]
        public async Task<ActionResult<Korisnik>> KreirajKorisnika([FromBody] KreirajKorisnikaDto noviKorisnikDto)
        {
            if (noviKorisnikDto == null)
                return BadRequest(new { Poruka = "Korisnik podaci su obavezni" });

            try
            {
                // Provjeri da li korisničko ime već postoji
                if (await baza.Korisnici.AnyAsync(k => k.KorisnickoIme == noviKorisnikDto.KorisnickoIme))
                {
                    return Conflict(new { Poruka = "Korisničko ime već postoji" });
                }

                if (await baza.Korisnici.AnyAsync(k => k.Email == noviKorisnikDto.Email))
                {
                    return Conflict(new { Poruka = "Email već postoji" });
                }

                var noviKorisnik = new Korisnik
                {
                    Ime = noviKorisnikDto.Ime,
                    Prezime = noviKorisnikDto.Prezime,
                    Email = noviKorisnikDto.Email,
                    KorisnickoIme = noviKorisnikDto.KorisnickoIme,
                    Telefon = noviKorisnikDto.Telefon,
                    Odjel = Enum.TryParse<Odjel>(noviKorisnikDto.Odjel, out var odjel) ? odjel : Odjel.Proizvodnja,
                    RadnoMjesto = noviKorisnikDto.RadnoMjesto,
                    StatusNaloga = noviKorisnikDto.StatusNaloga,
                    DatumZaposlenja = noviKorisnikDto.DatumZaposlenja,
                    // HashLozinke NE POSTAVLJATI OVDJE!
                    Napomene = noviKorisnikDto.Napomene ?? string.Empty
                };


                noviKorisnik.HashLozinke = passwordHasher.HashPassword(noviKorisnik, noviKorisnikDto.Lozinka);
                
                if (noviKorisnik.StatusNaloga == 0)
                    noviKorisnik.StatusNaloga = StatusNaloga.Aktivan;

                if (noviKorisnik.DatumZaposlenja == default)
                    noviKorisnik.DatumZaposlenja = DateOnly.FromDateTime(DateTime.Now);

                baza.Korisnici.Add(noviKorisnik);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajKorisnika), new { id = noviKorisnik.IdKorisnika }, noviKorisnik);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

    
        [HttpPut("{id}")]
        ////[Authorize]
        public async Task<ActionResult> UpdateKorisnika(int id, [FromBody] AzurirajKorisnikaDto noviPodaci)
        {
            try
            {
                if (noviPodaci == null)
                    return BadRequest(new { Poruka = "Podaci su obavezni" });

                // Dobij trenutnog korisnika iz tokena
                var trenutniKorisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var uloga = User.FindFirstValue(ClaimTypes.Role);

                // Provjeri prava pristupa
                if (uloga != nameof(RadnoMjesto.Admin) &&
                    (!int.TryParse(trenutniKorisnikId, out int trenutniId) || trenutniId != id))
                {
                    return Forbid(); // Ne možeš mijenjati tuđi profil
                }

                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                    return NotFound(new { Poruka = "Korisnik nije pronadjen" });

                trazeniKorisnik.Ime = noviPodaci.Ime ?? trazeniKorisnik.Ime;
                trazeniKorisnik.Prezime = noviPodaci.Prezime ?? trazeniKorisnik.Prezime;
                trazeniKorisnik.Odjel = Enum.TryParse<Odjel>(noviPodaci.Odjel, out var odjel) ? odjel : Odjel.Proizvodnja;
                trazeniKorisnik.Telefon = noviPodaci.Telefon ?? trazeniKorisnik.Telefon;


                // Samo admin može mijenjati radno mjesto i datum zaposlenja
                if (uloga == nameof(RadnoMjesto.Admin))
                {
                    if (noviPodaci.RadnoMjesto.HasValue)
                        trazeniKorisnik.RadnoMjesto = noviPodaci.RadnoMjesto.Value;

                    if (noviPodaci.DatumZaposlenja.HasValue)
                        trazeniKorisnik.DatumZaposlenja = noviPodaci.DatumZaposlenja.Value;
                }

                await baza.SaveChangesAsync();
                return Ok(new { Poruka = "Korisnik uspješno ažuriran" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // HTTP DELETE - Obriši korisnika (samo admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(RadnoMjesto.Admin))]
        public async Task<IActionResult> ObrisiKorisnika(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                    return NotFound(new { Poruka = "Korisnik nije pronadjen" });

                baza.Korisnici.Remove(trazeniKorisnik);
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Korisnik uspješno obrisan" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // AUTENTIFIKACIJA SA JWT TOKENOM
        [HttpPost("autentifikuj")]
        [AllowAnonymous]
        public async Task<IActionResult> Autentifikuj([FromBody] AutentifikacijaDto korisnikZaAutentifikaciju)
        {
            try
            {
                if (string.IsNullOrEmpty(korisnikZaAutentifikaciju.Email) &&
                    string.IsNullOrEmpty(korisnikZaAutentifikaciju.KorisnickoIme))
                {
                    return BadRequest(new { Poruka = "Email ili korisničko ime je obavezno" });
                }

                if (string.IsNullOrEmpty(korisnikZaAutentifikaciju.Lozinka))
                {
                    return BadRequest(new { Poruka = "Lozinka je obavezna" });
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
                    return Unauthorized(new { Poruka = "Pogrešni pristupni podaci" });
                }

                if (korisnikIzBaze.StatusNaloga != StatusNaloga.Aktivan)
                {
                    return Unauthorized(new { Poruka = "Korisnički račun nije aktivan" });
                }

                var lozinka = korisnikZaAutentifikaciju.Lozinka?.Trim();

                var odgovorHasiranja = passwordHasher.VerifyHashedPassword(
                    korisnikIzBaze, korisnikIzBaze.HashLozinke, lozinka);
                if (odgovorHasiranja == PasswordVerificationResult.Success)
                {
                    // Generiši JWT token
                    var token = jwtServis.GenerisiToken(korisnikIzBaze);

                    return Ok(new
                    {
                        Poruka = "Autentifikacija uspješna",
                        Token = token,
                        Istice = DateTime.UtcNow.AddHours(1),
                        Korisnik = new
                        {
                            IdKorisnika = korisnikIzBaze.IdKorisnika,
                            Ime = korisnikIzBaze.Ime,
                            Prezime = korisnikIzBaze.Prezime,
                            Email = korisnikIzBaze.Email,
                            KorisnickoIme = korisnikIzBaze.KorisnickoIme,
                            StatusNaloga = korisnikIzBaze.StatusNaloga.ToString(),
                            Telefon = korisnikIzBaze.Telefon,
                            RadnoMjesto = korisnikIzBaze.RadnoMjesto.ToString(),
                            DatumZaposljenja = korisnikIzBaze.DatumZaposlenja.ToString("yyyy-MM-dd"),
                            Odjel = korisnikIzBaze.Odjel
                        }
                    });
                }

                return Unauthorized(new { Poruka = "Pogrešna lozinka" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // Promjena lozinke (samo svoj profil ili admin)
        [HttpPut("{id}/promjeniLozinku")]
        //[Authorize]
        public async Task<IActionResult> PromjeniLozinku(int id, [FromBody] PromjenaLozinkeDto novaLozinka)
        {
            try
            {
                if (novaLozinka == null || string.IsNullOrEmpty(novaLozinka.NovaLozinka))
                {
                    return BadRequest(new { Poruka = "Nova lozinka je obavezna" });
                }

                // Dobij trenutnog korisnika iz tokena
                var trenutniKorisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var uloga = User.FindFirstValue(ClaimTypes.Role);

                // Provjeri prava pristupa
                if (uloga != nameof(RadnoMjesto.Admin) &&
                    (!int.TryParse(trenutniKorisnikId, out int trenutniId) || trenutniId != id))
                {
                    return Forbid(); // Ne možeš mijenjati tuđu lozinku
                }

                var korisnikIzBaze = await baza.Korisnici.FindAsync(id);
                if (korisnikIzBaze == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronaden" });
                }

                // Provjeri staru lozinku ako nije admin
                if (uloga != nameof(RadnoMjesto.Admin) && !string.IsNullOrEmpty(novaLozinka.NovaLozinka))
                {
                    var provjeraStare = passwordHasher.VerifyHashedPassword(
                        korisnikIzBaze, korisnikIzBaze.HashLozinke, novaLozinka.NovaLozinka);

                    if (provjeraStare != PasswordVerificationResult.Success)
                    {
                        return Unauthorized(new { Poruka = "Stara lozinka nije ispravna" });
                    }
                }

                korisnikIzBaze.HashLozinke = passwordHasher.HashPassword(korisnikIzBaze, novaLozinka.NovaLozinka);
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno izmjenjena lozinka" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // Ažuriranje kontakta (samo svoj profil)
        [HttpPut("{id}/azurirajKontakt")]
        //[Authorize]
        public async Task<IActionResult> AzurirajKontakt(int id, [FromBody] AzurirajKontaktDto noviKontakti)
        {
            try
            {
                if (noviKontakti == null)
                {
                    return BadRequest(new { Poruka = "Novi kontakti su obavezni" });
                }

                // Dobij trenutnog korisnika iz tokena
                var trenutniKorisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Korisnik može mijenjati samo svoje kontakte
                if (!int.TryParse(trenutniKorisnikId, out int trenutniId) || trenutniId != id)
                {
                    return Forbid();
                }

                var korisnikIzBaze = await baza.Korisnici.FindAsync(id);
                if (korisnikIzBaze == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronaden" });
                }

                // Provjeri da li email već postoji
                if (!string.IsNullOrEmpty(noviKontakti.Email) &&
                    noviKontakti.Email != korisnikIzBaze.Email)
                {
                    var postojiEmail = await baza.Korisnici
                        .AnyAsync(k => k.Email == noviKontakti.Email && k.IdKorisnika != id);

                    if (postojiEmail)
                    {
                        return BadRequest(new { Poruka = "Email već postoji" });
                    }
                }

                korisnikIzBaze.Email = noviKontakti.Email ?? korisnikIzBaze.Email;
                korisnikIzBaze.Telefon = noviKontakti.Telefon ?? korisnikIzBaze.Telefon;

                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno izmjenjeni kontakti" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // Deaktiviraj nalog (samo admin)
        [HttpPut("{id}/deaktivirajNalog")]
        [Authorize(Roles = nameof(RadnoMjesto.Admin))]
        public async Task<ActionResult> DeaktivirajNalog(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronadjen" });
                }

                trazeniKorisnik.StatusNaloga = StatusNaloga.Neaktivan;
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno deaktiviran nalog" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // Aktiviraj nalog (samo admin)
        [HttpPut("{id}/aktivirajNalog")]
        [Authorize(Roles = nameof(RadnoMjesto.Admin))]
        public async Task<ActionResult> AktivirajNalog(int id)
        {
            try
            {
                var trazeniKorisnik = await baza.Korisnici.FindAsync(id);
                if (trazeniKorisnik == null)
                {
                    return NotFound(new { Poruka = "Korisnik nije pronadjen" });
                }

                trazeniKorisnik.StatusNaloga = StatusNaloga.Aktivan;
                await baza.SaveChangesAsync();

                return Ok(new { Poruka = "Uspješno aktiviran nalog" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // Odjava
        [HttpPost("odjava")]
        //[Authorize]
        public IActionResult Odjava()
        {
            return Ok(new { Poruka = "Odjava uspješna" });
        }

        // Refresh token
        [HttpPost("refresh")]
        //[Authorize]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var trenutniKorisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!int.TryParse(trenutniKorisnikId, out int id))
                {
                    return Unauthorized();
                }

                var korisnik = await baza.Korisnici.FindAsync(id);
                if (korisnik == null || korisnik.StatusNaloga != StatusNaloga.Aktivan)
                {
                    return Unauthorized();
                }

                // Generiši novi token
                var noviToken = jwtServis.GenerisiToken(korisnik);

                return Ok(new
                {
                    Token = noviToken,
                    Istice = DateTime.UtcNow.AddHours(1)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska pri osvježavanju tokena", Greska = ex.Message });
            }
        }
    }
}