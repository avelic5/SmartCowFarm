using System;

namespace Backend.Controllers.Dtos;

public class JwtOdgovorDto
{
    public string Poruka { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime Istice { get; set; }
    public KorisnikInfoDto Korisnik { get; set; } = new();
}

