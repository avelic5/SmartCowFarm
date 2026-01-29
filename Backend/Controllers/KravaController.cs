using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Controllers.Dtos;

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
            try
            {
                return Ok(await baza.Krave.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //HTTP DAJ KRAVU PO IDU
        [HttpGet("{id}")]
        public async Task<ActionResult<Krava>> DajKravu(int id)
        {
            try
            {
                var trazenaKrava = await baza.Krave.FindAsync(id);
                if (trazenaKrava == null)
                {
                    return NotFound();
                }

                return Ok(trazenaKrava);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        //POST
        [HttpPost]
        public async Task<ActionResult<Krava>> KreirajKravu([FromBody] Krava novaKrava)
        {
            try
            {
                if (novaKrava == null)
                    return BadRequest();


                baza.Krave.Add(novaKrava);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajKravu), new { id = novaKrava.IdKrave }, novaKrava);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        //HTTP PUT PO IDU I IZMJENI KRAVU
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKravu(int id, [FromBody] Krava novaKrava)
        {
            try
            {
                if (novaKrava == null) return BadRequest();
                var trazenaKrava = await baza.Krave.FindAsync(id);

                if (trazenaKrava == null) return NotFound();

                //kraci nacin za mijenjane vrijednosti u varijablama
                baza.Entry(trazenaKrava).CurrentValues.SetValues(novaKrava);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        //HTTP DELETE kravu PO ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiKravu(int id)
        {
            try
            {
                var trazenaKrava = await baza.Krave.FindAsync(id);
                if (trazenaKrava == null) return NotFound();

                baza.Krave.Remove(trazenaKrava);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpGet("{id}/izracunajStarost")]
        public async Task<ActionResult<double>> IzracunajStarost(int id)
        {
            try
            {
                var krava = await baza.Krave.FindAsync(id);
                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                // Izračun starosti u godinama
                var danas = DateOnly.FromDateTime(DateTime.Now);
                var godine = (danas.DayNumber - krava.DatumRodjenja.DayNumber) / 365.25;

                return Ok(new
                {
                    StarostGodine = Math.Round(godine, 2),
                    DatumRodjenja = krava.DatumRodjenja
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/promjeniStatus")]
        public async Task<ActionResult> PromjeniStatus(int id, [FromBody] PromjeniStatusDto statusDto)
        {
            try
            {
                if (statusDto == null || !Enum.IsDefined(typeof(Models.Enums.StatusZdravlja), statusDto.NoviStatus))
                {
                    return BadRequest(new { Poruka = "Novi status nije validan" });
                }

                var krava = await baza.Krave.FindAsync(id);
                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                // Provjera specifičnih pravila
                if (krava.TrenutniStatus == Models.Enums.StatusZdravlja.Prodana)
                {
                    return BadRequest(new { Poruka = "Ne možete mijenjati status prodane krave" });
                }

                if (statusDto.NoviStatus == Models.Enums.StatusZdravlja.Prodana)
                {
                    // Provjera da li krava ima aktivan zdravstveni slučaj
                    var aktivanSlucaj = await baza.ZdravstveniSlucajevi
                        .AnyAsync(z => z.IdKrave == id &&
                                    z.StatusSlucaja != Models.Enums.StatusZdravlja.Neaktivna &&
                                    z.StatusSlucaja != Models.Enums.StatusZdravlja.Prodana);

                    if (aktivanSlucaj)
                    {
                        return BadRequest(new { Poruka = "Ne možete prodati kravu koja ima aktivan zdravstveni slučaj" });
                    }
                }

                var stariStatus = krava.TrenutniStatus;
                krava.TrenutniStatus = statusDto.NoviStatus;

                // Dodaj napomenu o promjeni statusa
                if (!string.IsNullOrWhiteSpace(statusDto.Napomena))
                {
                    krava.Napomene += (string.IsNullOrEmpty(krava.Napomene) ? "" : "\n") +
                                    $"[{DateTime.Now:dd.MM.yyyy HH:mm}] Promjena statusa: {stariStatus} -> {statusDto.NoviStatus}. {statusDto.Napomena}";
                }
                else
                {
                    krava.Napomene += (string.IsNullOrEmpty(krava.Napomene) ? "" : "\n") +
                                    $"[{DateTime.Now:dd.MM.yyyy HH:mm}] Promjena statusa: {stariStatus} -> {statusDto.NoviStatus}";
                }

                baza.Krave.Update(krava);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Status uspješno promijenjen",
                    StariStatus = stariStatus,
                    NoviStatus = krava.TrenutniStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpPut("{id}/dodaj-napomenu")]
        public async Task<ActionResult> DodajNapomenu(int id, [FromBody] TekstDto napomenaDto)
        {
            try
            {
                if (napomenaDto == null || string.IsNullOrWhiteSpace(napomenaDto.tekst))
                {
                    return BadRequest(new { Poruka = "Napomena je obavezna" });
                }

                var krava = await baza.Krave.FindAsync(id);
                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                var timestamp = DateTime.Now.ToString("dd.MM.yyyy HH:mm");
                var formatiranaNapomena = $"\n[{timestamp}] {napomenaDto.tekst}";

                krava.Napomene += (string.IsNullOrEmpty(krava.Napomene) ? "" : formatiranaNapomena);

                baza.Krave.Update(krava);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Napomena uspješno dodana",
                    UkupneNapomene = krava.Napomene
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        // 4. PROSJEČNA PROIZVODNJA KRAVE
        [HttpGet("{id}/prosjecnaProizvodnja")]
        public async Task<ActionResult<double>> ProsjecnaProizvodnja(int id)
        {
            try
            {
                var krava = await baza.Krave.FindAsync(id);
                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                // Dohvati sve mužnje za kravu
                var muznje = await baza.Muze
                    .Where(m => m.IdKrave == id)
                    .ToListAsync();

                if (!muznje.Any())
                {
                    return Ok(new
                    {
                        ProsjecnaProizvodnja = 0.0,
                        Poruka = "Nema podataka o muznjama za ovu kravu",
                        UkupnoMuznji = 0
                    });
                }

                var prosjek = muznje.Average(m => m.KolicinaLitara);

                return Ok(new
                {
                    ProsjecnaProizvodnja = Math.Round((double)prosjek, 2),
                    UkupnoMuznji = muznje.Count,
                    UkupnaKolicina = Math.Round((double)muznje.Sum(m => m.KolicinaLitara), 2),
                    PrvaMuza = muznje.Min(m => m.Datum),
                    ZadnjaMuza = muznje.Max(m => m.Datum)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPost("{id}/dodajMuzuKravi")]
        public async Task<ActionResult> DodajMuzu(int id, [FromBody] DodajMuzuDto muzaDto)
        {
            try
            {
                if (muzaDto == null || muzaDto.KolicinaLitara <= 0)
                {
                    return BadRequest(new { Poruka = "Količina mužnje mora biti veća od 0" });
                }

                var krava = await baza.Krave.FindAsync(id);
                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                // Provjera statusa krave
                if (krava.TrenutniStatus == Models.Enums.StatusZdravlja.Prodana ||
                    krava.TrenutniStatus == Models.Enums.StatusZdravlja.Neaktivna)
                {
                    return BadRequest(new
                    {
                        Poruka = $"Ne možete dodati mužnju za kravu sa statusom: {krava.TrenutniStatus}"
                    });
                }

                // Kreiranje nove mužnje
                var novaMuza = new Muza
                {
                    IdKrave = id,
                    Datum = muzaDto.Datum ?? DateOnly.FromDateTime(DateTime.Now),
                    VrijemePocetka = muzaDto.VrijemePocetka ?? TimeOnly.FromDateTime(DateTime.Now),
                    VrijemeZavrsretka = muzaDto.VrijemeZavrsetka ??
                                       (muzaDto.VrijemePocetka ?? TimeOnly.FromDateTime(DateTime.Now)).AddMinutes(5), // Default 5 minuta
                    KolicinaLitara = muzaDto.KolicinaLitara,
                    ProsjecanProtokLMin = muzaDto.ProsjecanProtokLMin ??
                                         (muzaDto.KolicinaLitara / 5), // Default: kolicina / 5 minuta
                    TemperaturaMlijeka = muzaDto.TemperaturaMlijeka ?? 37.0m, // Default temperatura
                    NacinUnosa = muzaDto.NacinUnosa ?? "MANUAL",
                    OznakaOdstupanja = muzaDto.OznakaOdstupanja ?? "NORMALNO",
                    Napomena = muzaDto.Napomena ?? ""
                };


                // Dodaj napomenu o mužnji
                if (!string.IsNullOrWhiteSpace(muzaDto.Napomena))
                {
                    krava.Napomene += (string.IsNullOrEmpty(krava.Napomene) ? "" : "\n") +
                                    $"[{DateTime.Now:dd.MM.yyyy HH:mm}] Dodana mužnja: {muzaDto.KolicinaLitara}L. {muzaDto.Napomena}";
                }

                // Spremanje u bazu
                await baza.Muze.AddAsync(novaMuza);
                baza.Krave.Update(krava);
                await baza.SaveChangesAsync();

                return Ok(new
                {
                    Poruka = "Mužnja uspješno dodana",
                    IdMuze = novaMuza.IdMuze,
                    TrajanjeMinute = (novaMuza.VrijemeZavrsretka.ToTimeSpan() - novaMuza.VrijemePocetka.ToTimeSpan()).TotalMinutes
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }
    }
}
