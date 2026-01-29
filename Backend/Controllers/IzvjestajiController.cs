using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Backend.Controllers.Dtos;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IzvjestajiController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        private readonly QuestPdfGenerator pdfGenerator;

        public IzvjestajiController(SmartCowFarmDatabaseContext context, QuestPdfGenerator pdfGenerator)
        {
            baza = context;
            this.pdfGenerator = pdfGenerator;
        }

        // 1. Generiši mjesečni izvještaj proizvodnje
        [HttpPost("mjesecnaProizvodnja")]
        public async Task<IActionResult> GenerisiMjesecniIzvjestajProizvodnje([FromBody] GenerisiIzvjestajDto dto)
        {
            try
            {
                if(dto.OdDatum > dto.DoDatum)
                {
                    return BadRequest(new { Poruka = "Neispravan period" });
                }

                var podaci = await DohvatiPodatkeZaIzvjestaj(dto.OdDatum, dto.DoDatum);

                var pdfBytes = pdfGenerator.GenerateMonthlyReportPdf(podaci);

                return File(pdfBytes, "application/pdf", $"Izvjestaj_proizvodnje_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greška pri generisanju izvještaja", Greska = ex.Message });
            }
        }

        // 2. Generiši karton krave
        [HttpPost("kartonKrave/{kravaId}")]
        public async Task<IActionResult> GenerisiKartonKrave(int kravaId)
        {
            try
            {
                // Pronađi kravu sa svim podacima
                var krava = await baza.Krave
                    .Include(k => k.Muze)
                    .Include(k => k.ZdravstveniSlucajevi)
                    .FirstOrDefaultAsync(k => k.IdKrave == kravaId);

                if (krava == null)
                {
                    return NotFound(new { Poruka = "Krava nije pronađena" });
                }

                
                var pdfBytes = pdfGenerator.GenerateCowCardPdf(krava);

                return File(pdfBytes, "application/pdf", $"Karton_krave_{krava.OznakaKrave}_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greška pri generisanju kartona", Greska = ex.Message });
            }
        }


        [HttpPost("zdravstveniIzvjestaj")]
        public async Task<IActionResult> GenerisiZdravstveniIzvjestaj([FromBody] GenerisiIzvjestajDto dto)
        {
            try
            {
                var podaci = await DohvatiPodatkeZaZdravstveniIzvjestaj(dto.OdDatum, dto.DoDatum);

                var pdfBytes = pdfGenerator.GenerateHealthReportPdf(podaci);

                return File(pdfBytes, "application/pdf", $"Zdravstveni_izvjestaj_{DateTime.Now:yyyyMMdd}.pdf");

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greška pri generisanju zdravstvenog izvjestaja", Greska = ex.Message });
            }
        }

        [HttpPost("izvjestajSenzora")]
        public async Task<IActionResult> GenerisiIzvjestajSenzora([FromBody] GenerisiIzvjestajDto dto)
        {
            try
            {
                var podaci = await DohvatiPodatkeZaSenzore(dto.OdDatum, dto.DoDatum);


                var pdfBytes = pdfGenerator.GenerateSensorsReportPdf(podaci, dto.OdDatum, dto.DoDatum);

            
                return File(pdfBytes, "application/pdf", $"Senzori_izvjestaj_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Poruka = "Greška pri generisanju", Greska = ex.Message });
            }
        }

        private async Task<MonthlyReportData> DohvatiPodatkeZaIzvjestaj(DateOnly odDatum, DateOnly doDatum)
        {
            // Dohvati mužnje za period
            var muznje = await baza.Muze
                .Where(m => m.Datum >= odDatum && m.Datum <= doDatum)
                .GroupBy(m => m.Datum)
                .Select(g => new DailyProduction
                {
                    Datum = g.Key,
                    Kolicina = g.Sum(m => m.KolicinaLitara),
                    ProsjekProtoka = g.Average(m => m.ProsjecanProtokLMin)
                })
                .OrderBy(x => x.Datum)
                .ToListAsync();

            // Ukupni podaci
            var ukupnoProizvodnje = muznje.Sum(m => m.Kolicina);
            var brojKrava = await baza.Krave.CountAsync(k => k.TrenutniStatus != Models.Enums.StatusZdravlja.Prodana);
            var brojDana = (doDatum.DayNumber - odDatum.DayNumber) + 1;

            return new MonthlyReportData
            {
                OdDatum = odDatum,
                DoDatum = doDatum,
                DnevnaProizvodnja = muznje,
                UkupnoProizvodnje = ukupnoProizvodnje,
                ProsjecnoDnevno = brojDana > 0 ? ukupnoProizvodnje / brojDana : 0,
                BrojKrava = brojKrava,
                ProsjecnoPoKravi = brojKrava > 0 ? ukupnoProizvodnje / brojKrava : 0
            };
        }

        private async Task<HealthReportData> DohvatiPodatkeZaZdravstveniIzvjestaj(DateOnly odDatum, DateOnly doDatum)
        {
            
            var slucajevi = await baza.ZdravstveniSlucajevi
                .Where(z => z.DatumOtvaranja >= odDatum && z.DatumOtvaranja <= doDatum)
                .Include(z => z.Krava)
                .ToListAsync();

            var poStatusu = slucajevi
                .GroupBy(z => z.StatusSlucaja)
                .Select(g => new StatusCount { Status = g.Key.ToString(), Broj = g.Count() })
                .ToList();

            return new HealthReportData
            {
                OdDatum = odDatum,
                DoDatum = doDatum,
                Slucajevi = slucajevi,
                UkupnoSlucajeva = slucajevi.Count,
                PoStatusu = poStatusu
            };
        }


        private async Task<List<OcitanjeSenzora>> DohvatiPodatkeZaSenzore(DateOnly odDatum, DateOnly doDatum)
        {
            var ocitavanja = await baza.OcitanjaSenzora
                .Where(o => DateOnly.FromDateTime(o.Timestamp) >= odDatum &&
                        DateOnly.FromDateTime(o.Timestamp) <= doDatum)
                .Include(o => o.Senzor)
                .ToListAsync();

            return ocitavanja;
        }

    }


}