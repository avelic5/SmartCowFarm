using System;

namespace Backend.Controllers.Dtos;

public class DodajTerapijuDto
{
    public int IdTerapije { get; set; }
    public float Kolicina { get; set; }
    public int IdIzvrsioca { get; set; }
    public string? Napomena { get; set; }
}
