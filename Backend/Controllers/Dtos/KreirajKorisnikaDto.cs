namespace Backend.Controllers.Dtos
{
    public class KreirajKorisnikaDto
    {
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string KorisnickoIme { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Odjel { get; set; } = string.Empty;
        public string Lozinka { get; set; } = string.Empty;
        public string Napomene { get; set; } = string.Empty;
        public Backend.Models.Enums.RadnoMjesto RadnoMjesto { get; set; }
        public Backend.Models.Enums.StatusNaloga StatusNaloga { get; set; }
        public DateOnly DatumZaposlenja { get; set; }
    }
}