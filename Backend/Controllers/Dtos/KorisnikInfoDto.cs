using System;

namespace Backend.Controllers.Dtos;

public class KorisnikInfoDto
{
    public int IdKorisnika { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string KorisnickoIme { get; set; } = string.Empty;
    public string StatusNaloga { get; set; } = string.Empty;
    public string? Telefon { get; set; }
    public string? RadnoMjesto { get; set; }
    public DateTime? DatumZaposlenja { get; set; }
    public string? Odjel { get; set; }
    public string[]? Uloge { get; set; }
}
