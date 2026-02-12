namespace Backend.Controllers.Dtos
{
    public class AzurirajKorisnikaDto
    {
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string? Email { get; set; }
        public string? Odjel { get; set; }
        public string? Telefon { get; set; }
        public Backend.Models.Enums.RadnoMjesto? RadnoMjesto { get; set; }
        public DateOnly? DatumZaposlenja { get; set; }
        public string? Napomene { get; set; }
    }
}