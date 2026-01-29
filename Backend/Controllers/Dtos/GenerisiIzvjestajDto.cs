using System;

namespace Backend.Controllers.Dtos;

public class GenerisiIzvjestajDto
{
    public DateOnly OdDatum { get; set; }
    public DateOnly DoDatum { get; set; }
    public int? KravaId { get; set; }
    public string? Grupa { get; set; }
}
