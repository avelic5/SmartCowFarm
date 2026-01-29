using System;
using Backend.Models;

namespace Backend.Controllers.Dtos;

public class HealthReportData
{
    public DateOnly OdDatum { get; set; }
    public DateOnly DoDatum { get; set; }
    public List<ZdravstveniSlucaj> Slucajevi { get; set; } = new();
    public int UkupnoSlucajeva { get; set; }
    public List<StatusCount> PoStatusu { get; set; } = new();
}
