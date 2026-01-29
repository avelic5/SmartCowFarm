using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers.Dtos;

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
            try
            {
                return Ok(await baza.Terapije.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // HTTP GET – jedna terapija po id
        [HttpGet("{id}")]
        public async Task<ActionResult<Terapija>> DajTerapiju(int id)
        {
            try
            {
                var trazenaTerapija = await baza.Terapije.FindAsync(id);
                if (trazenaTerapija == null) return NotFound();

                return Ok(trazenaTerapija);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        // POST – kreiranje terapije
        [HttpPost]
        public async Task<ActionResult<Terapija>> KreirajTerapiju([FromBody] Terapija novaTerapija)
        {
            try
            {
                if (novaTerapija == null)
                    return BadRequest();

                baza.Terapije.Add(novaTerapija);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajTerapiju), new { id = novaTerapija.IdTerapije }, novaTerapija);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // PUT – update terapije
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTerapija(int id, [FromBody] Terapija novaTerapija)
        {
            try
            {
                if (novaTerapija == null) return BadRequest();

                var trazenaTerapija = await baza.Terapije.FindAsync(id);
                if (trazenaTerapija == null) return NotFound();

                baza.Entry(trazenaTerapija).CurrentValues.SetValues(novaTerapija);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // DELETE – brisanje terapije
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiTerapiju(int id)
        {
            try
            {
                var trazenaTerapija = await baza.Terapije.FindAsync(id);
                if (trazenaTerapija == null) return NotFound();

                baza.Terapije.Remove(trazenaTerapija);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/promjeniDoza")]
        public async Task<ActionResult> PromjeniDoza(int id, [FromBody] PromjeniDozuDto dto)
        {
            try
            {
                var terapija = await baza.Terapije.FindAsync(id);
                if (terapija == null) return NotFound(new { Poruka = "Terapija nije pronađena" });

                if (dto.NovaDoza <= 0)
                    return BadRequest(new { Poruka = "Doza mora biti veća od 0" });

                var staraDoza = terapija.Doza;
                terapija.Doza = dto.NovaDoza;

                // Dodaj napomenu o promjeni
                terapija.Napomena += (string.IsNullOrEmpty(terapija.Napomena) ? "" : "\n") +
                                $"[{DateTime.Now:dd.MM.yyyy HH:mm}] Promjena doze: {staraDoza} {terapija.JedinicaMjere} → {dto.NovaDoza} {terapija.JedinicaMjere}." +
                                (string.IsNullOrWhiteSpace(dto.Razlog) ? "" : $" Razlog: {dto.Razlog}");

                baza.Terapije.Update(terapija);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Doza terapije uspješno promijenjena",
                    Id = terapija.IdTerapije,
                    StaraDoza = $"{staraDoza} {terapija.JedinicaMjere}",
                    NovaDoza = $"{terapija.Doza} {terapija.JedinicaMjere}",
                    Napomena = terapija.Napomena
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/zakaziPeriod")]
        public async Task<ActionResult> ZakaziPeriod(int id, [FromBody] ZakaziPeriodDto dto)
        {
            try
            {
                var terapija = await baza.Terapije.FindAsync(id);
                if (terapija == null) return NotFound(new { Poruka = "Terapija nije pronađena" });

                if (dto.NoviPocetak >= dto.NoviKraj)
                    return BadRequest(new { Poruka = "Datum početka mora biti prije datuma kraja" });

                var stariPocetak = terapija.DatumPocetka;
                var stariKraj = terapija.DatumKraja;

                terapija.DatumPocetka = dto.NoviPocetak;
                terapija.DatumKraja = dto.NoviKraj;

                // Izračun novog trajanja
                var novoTrajanje = (dto.NoviKraj.DayNumber - dto.NoviPocetak.DayNumber);
                terapija.TrajanjeDana = novoTrajanje;

                // Dodaj napomenu
                terapija.Napomena += (string.IsNullOrEmpty(terapija.Napomena) ? "" : "\n") +
                                $"[{DateTime.Now:dd.MM.yyyy HH:mm}] Promjena perioda: {stariPocetak:dd.MM.yyyy}-{stariKraj:dd.MM.yyyy} → {dto.NoviPocetak:dd.MM.yyyy}-{dto.NoviKraj:dd.MM.yyyy}." +
                                (string.IsNullOrWhiteSpace(dto.Razlog) ? "" : $" Razlog: {dto.Razlog}");

                baza.Terapije.Update(terapija);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Period terapije uspješno zakažan",
                    Id = terapija.IdTerapije,
                    Period = $"{terapija.DatumPocetka:dd.MM.yyyy} - {terapija.DatumKraja:dd.MM.yyyy}",
                    TrajanjeDana = terapija.TrajanjeDana,
                    Status = terapija.DatumKraja < DateOnly.FromDateTime(DateTime.Now) ? "ZAVRŠENA" :
                            terapija.DatumPocetka > DateOnly.FromDateTime(DateTime.Now) ? "ZAKAZANA" : "U TOKU"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodajUputstvo")]
        public async Task<ActionResult> DodajUputstvo(int id, [FromBody] TekstDto dto)
        {
            try
            {
                var terapija = await baza.Terapije.FindAsync(id);
                if (terapija == null) return NotFound(new { Poruka = "Terapija nije pronađena" });

                if (string.IsNullOrWhiteSpace(dto.tekst))
                    return BadRequest(new { Poruka = "Uputstvo ne može biti prazno" });

                // Dodaj novo uputstvo (dodaje se, ne zamjenjuje)
                var timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm");
                var novoUputstvo = $"\n--- Uputstvo [{timestamp}] ---\n{dto.tekst}\n";

                terapija.Uputstvo += novoUputstvo;

                baza.Terapije.Update(terapija);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Uputstvo uspješno dodano",
                    Id = terapija.IdTerapije,
                    NazivLijeka = terapija.NazivLijeka,
                    CijeloUputstvo = terapija.Uputstvo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPost("{id}/kreirajAplikaciju")]
        public async Task<ActionResult> KreirajAplikaciju(int id, [FromBody] KreirajAplikacijuDto dto)
        {
            try
            {
                var terapija = await baza.Terapije.FindAsync(id);
                if (terapija == null) return NotFound(new { Poruka = "Terapija nije pronađena" });

                // Validacija
                if (dto.Kolicina <= 0)
                    return BadRequest(new { Poruka = "Količina mora biti veća od 0" });

                if (dto.Kolicina > terapija.Doza * 1.5m) // Dozvoljeno +50% od propisane doze
                    return BadRequest(new { Poruka = $"Količina prevelika. Propisana doza: {terapija.Doza} {terapija.JedinicaMjere}" });

                // Provjera perioda
                var danas = DateOnly.FromDateTime(DateTime.Now);
                if (danas < terapija.DatumPocetka || danas > terapija.DatumKraja)
                    return BadRequest(new { Poruka = $"Terapija nije aktívna. Period: {terapija.DatumPocetka:dd.MM.yyyy} - {terapija.DatumKraja:dd.MM.yyyy}" });

                // Kreiranje aplikacije
                var aplikacija = new TerapijaAplikacije
                {
                    IdTerapije = id,
                    DatumVrijeme = dto.DatumVrijeme ?? DateTime.Now,
                    PrimijenjenaKolicina = dto.Kolicina,
                    IdIzvrsilac = dto.IdIzvrsilac,
                    Napomena = dto.Napomena ?? ""
                };

                // Dodaj napomenu u terapiju
                var vrijeme = aplikacija.DatumVrijeme.ToString("dd.MM.yyyy HH:mm");
                terapija.Napomena += (string.IsNullOrEmpty(terapija.Napomena) ? "" : "\n") +
                                $"[{vrijeme}] Primijenjeno: {dto.Kolicina} {terapija.JedinicaMjere}. {dto.Napomena}";

                // Spremanje
                await baza.TerapijeAplikacije.AddAsync(aplikacija);
                baza.Terapije.Update(terapija);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Aplikacija terapije uspješno kreirana",
                    Aplikacija = new
                    {
                        aplikacija.IdAplikacije,
                        Vrijeme = aplikacija.DatumVrijeme.ToString("dd.MM.yyyy HH:mm"),
                        Kolicina = $"{aplikacija.PrimijenjenaKolicina} {terapija.JedinicaMjere}",
                        IzvrsilacId = aplikacija.IdIzvrsilac,
                        aplikacija.Napomena
                    },
                    Terapija = new
                    {
                        terapija.IdTerapije,
                        terapija.NazivLijeka,
                        PropisanaDoza = $"{terapija.Doza} {terapija.JedinicaMjere}"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

    }
}
