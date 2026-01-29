using System;

namespace Backend.Controllers.Dtos;

public class MonthlyReportData
{
    public DateOnly OdDatum { get; set; }
    public DateOnly DoDatum { get; set; }
    public List<DailyProduction> DnevnaProizvodnja { get; set; } = new();
    public decimal UkupnoProizvodnje { get; set; }
    public decimal ProsjecnoDnevno { get; set; }
    public int BrojKrava { get; set; }
    public decimal ProsjecnoPoKravi { get; set; }
}
