using System;

namespace Backend.Controllers.Dtos;

public class AutentifikacijaDto
{
    public string? Email { get; set; }
    public string? KorisnickoIme { get; set; }
    public string? Lozinka { get; set; } = String.Empty;
}
