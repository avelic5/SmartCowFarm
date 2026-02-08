using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class MuzaController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public MuzaController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<List<Muza>>> DajMuze()
        {
            try
            {
                return Ok(await baza.Muze.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }


        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<Muza>> DajMuzu(int id)
        {
            try
            {
                var trazenaMuza = await baza.Muze.FindAsync(id);
                if (trazenaMuza == null)
                {
                    return NotFound();
                }

                return Ok(trazenaMuza);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<Muza>> KreirajMuzu([FromBody] Muza novaMuza)
        {
            try
            {
                if (novaMuza == null)
                    return BadRequest();


                baza.Muze.Add(novaMuza);
                await baza.SaveChangesAsync();

                return CreatedAtAction(nameof(DajMuzu), new { id = novaMuza.IdMuze }, novaMuza);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }


        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult> UpdateMuzu(int id, [FromBody] Muza novaMuza)
        {
            try
            {
                if (novaMuza == null) return BadRequest();
                var trazenaMuza = await baza.Muze.FindAsync(id);

                if (trazenaMuza == null) return NotFound();

                //kraci nacin za mijenjane vrijednosti u varijablama
                baza.Entry(trazenaMuza).CurrentValues.SetValues(novaMuza);

                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa spremanjem u bazu", Greska = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> ObrisiMuzu(int id)
        {
            try
            {
                var trazenaMuza = await baza.Muze.FindAsync(id);
                if (trazenaMuza == null) return NotFound();

                baza.Muze.Remove(trazenaMuza);
                await baza.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpGet("{idMuze}/trajanje")]
        //[Authorize]
        public async Task<ActionResult> IzracunajTrajanje(int idMuze)
        {
            try
            {
                var muza = await baza.Muze.FindAsync(idMuze);
                if (muza == null)
                {
                    return NotFound(new { Poruka = "Mužnja nije pronađena" });
                }

                var trajanje = (muza.VrijemeZavrsretka.ToTimeSpan() - muza.VrijemePocetka.ToTimeSpan());

                return Ok(new
                {
                    IdMuze = muza.IdMuze,
                    IdKrave = muza.IdKrave,
                    Datum = muza.Datum,
                    VrijemePocetka = muza.VrijemePocetka.ToString("HH:mm:ss"),
                    VrijemeZavrsetka = muza.VrijemeZavrsretka.ToString("HH:mm:ss"),
                    TrajanjeUkupno = new
                    {
                        Sati = trajanje.Hours,
                        Minute = trajanje.Minutes,
                        Sekunde = trajanje.Seconds,
                        UkupnoMinuta = Math.Round(trajanje.TotalMinutes, 2),
                        UkupnoSati = Math.Round(trajanje.TotalHours, 2)
                    },
                    Poruka = $"Mužnja je trajala {trajanje.Hours}h {trajanje.Minutes}min {trajanje.Seconds}s"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpGet("{idMuze}/validirajKolicinu")]
        //[Authorize]
        public async Task<ActionResult> ValidirajKolicinu(int idMuze)
        {
            try
            {
                var muza = await baza.Muze.FindAsync(idMuze);
                if (muza == null)
                {
                    return NotFound(new { Poruka = "Mužnja nije pronađena" });
                }

                var trajanje = muza.VrijemeZavrsretka.ToTimeSpan() - muza.VrijemePocetka.ToTimeSpan();
                var trajanjeSati = trajanje.TotalHours;

                // Pravila validacije
                var validacije = new List<string>();
                var ispravno = true;

                // 1. Količina mora biti pozitivna
                if (muza.KolicinaLitara <= 0)
                {
                    validacije.Add("Količina mora biti veća od 0");
                    ispravno = false;
                }
                else
                {
                    validacije.Add("Količina je pozitivna");
                }

                // 2. Vrijeme završetka mora biti nakon vremena početka
                if (muza.VrijemeZavrsretka <= muza.VrijemePocetka)
                {
                    validacije.Add("Vrijeme završetka mora biti nakon vremena početka");
                    ispravno = false;
                }
                else
                {
                    validacije.Add("Vrijeme završetka je nakon početka");
                }

                // 3. Provjera realnosti količine (prosječno 10-30 litara po mužnji)
                if (muza.KolicinaLitara < 1)
                {
                    validacije.Add("Količina je vrlo mala (ispod 1L)");
                }
                else if (muza.KolicinaLitara > 50)
                {
                    validacije.Add("Količina je vrlo velika (preko 50L)");
                }
                else
                {
                    validacije.Add("Količina je u normalnom rasponu");
                }

                // 4. Provjera protoka (normalno 2-8 L/min)
                if (trajanjeSati > 0)
                {
                    var protok = muza.KolicinaLitara / (decimal)trajanje.TotalMinutes;
                    if (protok < 2)
                    {
                        validacije.Add($"Protok je nizak: {Math.Round((double)protok, 2)} L/min (normalno 2-8 L/min)");
                    }
                    else if (protok > 8)
                    {
                        validacije.Add($"Protok je visok: {Math.Round((double)protok, 2)} L/min (normalno 2-8 L/min)");
                    }
                    else
                    {
                        validacije.Add($"Protok je normalan: {Math.Round((double)protok, 2)} L/min");
                    }
                }

                // 5. Provjera temperature (normalno 35-39°C)
                if (muza.TemperaturaMlijeka < 35 || muza.TemperaturaMlijeka > 39)
                {
                    validacije.Add($"Temperatura mlijeka je izvan normalnog raspona: {muza.TemperaturaMlijeka}°C (normalno 35-39°C)");
                    ispravno = false;
                }
                else
                {
                    validacije.Add($"Temperatura mlijeka je normalna: {muza.TemperaturaMlijeka}°C");
                }

                return Ok(new
                {
                    IdMuze = muza.IdMuze,
                    Datum = muza.Datum,
                    KolicinaLitara = muza.KolicinaLitara,
                    TrajanjeMinuta = Math.Round(trajanje.TotalMinutes, 2),
                    Validno = ispravno,
                    Validacije = validacije,
                    Preporuka = ispravno ? "Mužnja je validna" : "Pronađeni su problemi u podacima mužnje"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

        [HttpGet("{idMuze}/protok")]
        //[Authorize]
        public async Task<ActionResult> IzracunajProtok(int idMuze)
        {
            try
            {
                var muza = await baza.Muze.FindAsync(idMuze);
                if (muza == null)
                {
                    return NotFound(new { Poruka = "Mužnja nije pronađena" });
                }

                var trajanje = muza.VrijemeZavrsretka.ToTimeSpan() - muza.VrijemePocetka.ToTimeSpan();
                var trajanjeMinuta = trajanje.TotalMinutes;

                if (trajanjeMinuta <= 0)
                {
                    return BadRequest(new { Poruka = "Trajanje mužnje mora biti veće od 0" });
                }

                var protok = muza.KolicinaLitara / (decimal)trajanjeMinuta;
                var avgLitaraPoMinuti = muza.ProsjecanProtokLMin; // Ako već postoji u modelu

                // Kategorizacija protoka
                string kategorija;
                if (protok < 2) kategorija = "NIZAK";
                else if (protok >= 2 && protok <= 4) kategorija = "OPTIMALAN";
                else if (protok > 4 && protok <= 8) kategorija = "VISOK";
                else kategorija = "VEOMA VISOK";

                // Analiza učinkovitosti
                string analiza;
                if (protok < 2)
                {
                    analiza = "Protok je ispod optimalnog. Mogući razlozi: problem s opremom, zdravstveno stanje krave ili nepravilan postupak.";
                }
                else if (protok >= 2 && protok <= 4)
                {
                    analiza = "Protok je optimalan. Krava je zdrava i postupak mužnje je ispravan.";
                }
                else if (protok > 4 && protok <= 8)
                {
                    analiza = "Protok je iznad prosjeka. Ovo može biti pozitivno (visokoproduktivna krava) ili negativno (pregruba mužnja).";
                }
                else
                {
                    analiza = "Protok je vrlo visok. Provjerite opremu i postupak mužnje kako biste izbjegli oštećenje vimena.";
                }

                return Ok(new
                {
                    IdMuze = muza.IdMuze,
                    IdKrave = muza.IdKrave,
                    Datum = muza.Datum,
                    OsnovniPodaci = new
                    {
                        KolicinaLitara = muza.KolicinaLitara,
                        TrajanjeUkupnoMinuta = Math.Round(trajanjeMinuta, 2),
                        VrijemePocetka = muza.VrijemePocetka.ToString("HH:mm"),
                        VrijemeZavrsetka = muza.VrijemeZavrsretka.ToString("HH:mm")
                    },
                    Protok = new
                    {
                        LitaraPoMinuti = Math.Round((double)protok, 2),
                        LitaraPoSatu = Math.Round((double)(protok * 60), 2),
                        Kategorija = kategorija,
                        RazlikaOdProsjecnog = avgLitaraPoMinuti != 0
                            ? Math.Round((double)((protok - avgLitaraPoMinuti) / avgLitaraPoMinuti * 100), 2)
                            : (double?)null
                    },
                    Analiza = analiza,
                    Preporuke = kategorija == "NIZAK"
                        ? new[] { "Provjerite opremu za mužnju", "Kontrolirajte zdravstveno stanje krave", "Obavite pregled vimena" }
                        : kategorija == "VEOMA VISOK"
                            ? new[] { "Umanjite pritisak pri mužnji", "Provjerite rad opreme", "Kontrolirajte vrijeme mužnje" }
                            : new string[] { "Nastavite s postojećim postupkom" }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greska sa bazom", Greska = ex.Message });
            }
        }

    }
}
