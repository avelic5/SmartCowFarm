using System;
using System.ComponentModel.DataAnnotations;
using Backend.Models.Enums;

namespace Backend.Models;

public class Korisnik
{
    [Key]
    public int IdKorisnika { get; set; }
    [Required]
    public string Ime { get; set; } = null!;
    [Required]
    public string Prezime { get; set; } = null!;
    public RadnoMjesto RadnoMjesto { get; set; } 
    [Required]
    public string KorisnickoIme { get; set; } = null!;
    [Required]
    public string HashLozinke { get; set; } = null!;
    public string Telefon { get; set; } = null!;
    [EmailAddress]
    public string Email { get; set; } = null!;
    [Required]
    public DateOnly DatumZaposlenja { get; set; }
    public Odjel Odjel { get; set; } 
    public StatusNaloga StatusNaloga { get; set; }
    public string Napomene { get; set; } = null!;
}
