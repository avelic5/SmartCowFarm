using System;

namespace Backend.Controllers.Dtos;

public class KalibracijaDto
{
    public double StvarnaVrijednost { get; set; }
    public double? OcitanaVrijednost { get; set; }
    public DateOnly? DatumKalibracije { get; set; }
    public decimal? NoviNormalnoMin { get; set; }
    public decimal? NoviNormalnoMax { get; set; }
    public decimal? NoviKriticnoMin { get; set; }
    public decimal? NoviKriticnoMax { get; set; }
    public decimal? Napomena { get; set; }
}
