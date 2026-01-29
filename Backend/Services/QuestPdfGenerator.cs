// Services/QuestPdfGenerator.cs
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Backend.Controllers;
using Backend.Models;
using Backend.Controllers.Dtos;

namespace Backend.Services
{
    public class QuestPdfGenerator
    {
        public byte[] GenerateMonthlyReportPdf(MonthlyReportData podaci)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .AlignCenter()
                        .Text("IZVJEŠTAJ PROIZVODNJE MLIJEKA")
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Period
                            column.Item()
                                .Text($"Period: {podaci.OdDatum:dd.MM.yyyy} - {podaci.DoDatum:dd.MM.yyyy}")
                                .FontSize(12);

                            // Statistika
                            column.Item().PaddingTop(10).Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                });

                                table.Cell().Border(1).Padding(5).Text("Ukupna proizvodnja:");
                                table.Cell().Border(1).Padding(5).Text($"{podaci.UkupnoProizvodnje} L");

                                table.Cell().Border(1).Padding(5).Text("Prosječno po danu:");
                                table.Cell().Border(1).Padding(5).Text($"{podaci.ProsjecnoDnevno:F2} L/dan");

                                table.Cell().Border(1).Padding(5).Text("Broj krava:");
                                table.Cell().Border(1).Padding(5).Text($"{podaci.BrojKrava}");

                                table.Cell().Border(1).Padding(5).Text("Prosječno po kravi:");
                                table.Cell().Border(1).Padding(5).Text($"{podaci.ProsjecnoPoKravi:F2} L/krava");
                            });

                            // Tabela dnevne proizvodnje
                            if (podaci.DnevnaProizvodnja.Any())
                            {
                                column.Item().PaddingTop(20).Text("Dnevna proizvodnja").FontSize(14).SemiBold();

                                column.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                    });

                                    // Header
                                    table.Header(header =>
                                    {
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Datum");
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Količina (L)");
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Protok (L/min)");
                                    });

                                    // Rows
                                    foreach (var dan in podaci.DnevnaProizvodnja)
                                    {
                                        table.Cell().BorderBottom(1).Padding(5).Text(dan.Datum.ToString("dd.MM.yyyy"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(dan.Kolicina.ToString("F1"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(dan.ProsjekProtoka.ToString("F2"));
                                    }
                                });
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Smart Cow Farm • ");
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateCowCardPdf(Krava krava)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .AlignCenter()
                        .Text($"KARTON KRAVE - {krava.OznakaKrave}")
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Osnovni podaci
                            column.Item().Text($"Oznaka: {krava.OznakaKrave}").FontSize(12);
                            column.Item().Text($"Rasa: {krava.Rasa}").FontSize(12);
                            column.Item().Text($"Datum rođenja: {krava.DatumRodjenja:dd.MM.yyyy}").FontSize(12);
                            column.Item().Text($"Status: {krava.TrenutniStatus}").FontSize(12);

                            // Historija mužnje
                            if (krava.Muze != null && krava.Muze.Any())
                            {
                                column.Item().PaddingTop(20).Text("Historija mužnje").FontSize(14).SemiBold();

                                column.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                    });

                                    // Header
                                    table.Header(header =>
                                    {
                                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Datum");
                                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Količina (L)");
                                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Protok (L/min)");
                                        header.Cell().Background(Colors.Grey.Lighten3).Padding(5).Text("Temp (°C)");
                                    });

                                    // Rows
                                    foreach (var muza in krava.Muze.OrderByDescending(m => m.Datum).Take(15))
                                    {
                                        table.Cell().BorderBottom(1).Padding(5).Text(muza.Datum.ToString("dd.MM.yyyy"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(muza.KolicinaLitara.ToString("F1"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(muza.ProsjecanProtokLMin.ToString("F2"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(muza.TemperaturaMlijeka.ToString("F1"));
                                    }
                                });
                            }

                            // Zdravstveni slučajevi
                            if (krava.ZdravstveniSlucajevi != null && krava.ZdravstveniSlucajevi.Any())
                            {
                                column.Item().PaddingTop(20).Text("Zdravstveni slučajevi").FontSize(14).SemiBold();

                                foreach (var slucaj in krava.ZdravstveniSlucajevi.OrderByDescending(z => z.DatumOtvaranja))
                                {
                                    column.Item()
                                        .Background(Colors.Grey.Lighten5)
                                        .Border(1)
                                        .Padding(10)
                                        .Column(slucajColumn =>
                                        {
                                            slucajColumn.Item().Text($"Datum: {slucaj.DatumOtvaranja:dd.MM.yyyy}").SemiBold();
                                            slucajColumn.Item().Text($"Status: {slucaj.StatusSlucaja}");
                                            slucajColumn.Item().Text($"Simptomi: {slucaj.OpisSimptoma}");

                                            if (!string.IsNullOrEmpty(slucaj.Dijagnoza))
                                            {
                                                slucajColumn.Item().Text($"Dijagnoza: {slucaj.Dijagnoza}");
                                            }
                                        });
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Smart Cow Farm • ");
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }
        public byte[] GenerateHealthReportPdf(HealthReportData podaci)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .AlignCenter()
                        .Text("ZDRAVSTVENI IZVJEŠTAJ")
                        .SemiBold().FontSize(18).FontColor(Colors.Red.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Period
                            column.Item()
                                .Text($"Period: {podaci.OdDatum:dd.MM.yyyy} - {podaci.DoDatum:dd.MM.yyyy}")
                                .FontSize(12);

                            column.Item().Text($"Ukupno slučajeva: {podaci.UkupnoSlucajeva}")
                                .FontSize(12).SemiBold();

                            // Statistika po statusu
                            if (podaci.PoStatusu.Any())
                            {
                                column.Item().PaddingTop(20).Text("Statistika po statusu").FontSize(16).SemiBold();

                                column.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                    });

                                    foreach (var status in podaci.PoStatusu)
                                    {
                                        table.Cell().BorderBottom(1).Padding(8).Text(status.Status);
                                        table.Cell().BorderBottom(1).Padding(8).Text(status.Broj.ToString());
                                    }
                                });
                            }

                            // Detalji slučajeva
                            if (podaci.Slucajevi.Any())
                            {
                                column.Item().PaddingTop(30).Text("Detalji slučajeva").FontSize(16).SemiBold();

                                foreach (var slucaj in podaci.Slucajevi.OrderByDescending(s => s.DatumOtvaranja))
                                {
                                    column.Item()
                                        .Background(Colors.Orange.Lighten5)
                                        .Border(1)
                                        .Padding(10)
                                        .Column(slucajColumn =>
                                        {
                                            slucajColumn.Item().Text($"{slucaj.Krava?.OznakaKrave ?? "N/A"} - {slucaj.DatumOtvaranja:dd.MM.yyyy}")
                                                .SemiBold().FontSize(12);

                                            slucajColumn.Item().Text($"Status: {slucaj.StatusSlucaja}");
                                            slucajColumn.Item().Text($"Simptomi: {slucaj.OpisSimptoma}");

                                            if (!string.IsNullOrEmpty(slucaj.Dijagnoza))
                                            {
                                                slucajColumn.Item().Text($"Dijagnoza: {slucaj.Dijagnoza}");
                                            }
                                        });
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Smart Cow Farm • ");
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        // U QuestPdfGenerator.cs - OVO JE ISPRAVNO:
        public byte[] GenerateSensorsReportPdf(List<OcitanjeSenzora> ocitanja, DateOnly odDatum, DateOnly doDatum)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(1.5f, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .AlignCenter()
                        .Text("IZVJEŠTAJ OCITANJA SENZORA")
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(0.5f, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Period
                            column.Item()
                                .Text($"Period: {odDatum:dd.MM.yyyy} - {doDatum:dd.MM.yyyy}")
                                .FontSize(11);

                            column.Item().Text($"Ukupno očitanja: {ocitanja.Count}")
                                .FontSize(11).SemiBold();

                            // Tabela
                            if (ocitanja.Any())
                            {
                                column.Item().PaddingTop(10).Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn();
                                        columns.RelativeColumn();
                                        columns.RelativeColumn(2);
                                    });

                                    // Header
                                    table.Header(header =>
                                    {
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Datum i vrijeme").SemiBold();
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Senzor").SemiBold();
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Vrijednost").SemiBold();
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Status").SemiBold();
                                        header.Cell().Background(Colors.Blue.Lighten3).Padding(5).Text("Napomena").SemiBold();
                                    });

                                    // Rows - koristi 'ocitanja' (listu)
                                    foreach (var o in ocitanja.OrderBy(o => o.Timestamp).Take(100))
                                    {
                                        table.Cell().BorderBottom(1).Padding(5).Text(o.Timestamp.ToString("dd.MM.yyyy HH:mm"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(o.Senzor?.Naziv ?? "N/A");
                                        table.Cell().BorderBottom(1).Padding(5).Text(o.Vrijednost.ToString("F2"));
                                        table.Cell().BorderBottom(1).Padding(5).Text(o.StatusOcitanja.ToString());
                                        table.Cell().BorderBottom(1).Padding(5).Text(o.Napomena ?? "-");
                                    }
                                });
                            }

                        });
                    page.Footer()
                .AlignCenter()
                .Text(x =>
                {
                    x.Span("Smart Cow Farm • ");
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
                });
            });

            return document.GeneratePdf();
        }

    }
}