using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Dtos;

public class ZdravstveniSlucajDto
{
    public int idKrave { get; set; }
    public string? razlogOtvaranja { get; set; }
    public string? opisSimptoma { get; set; }
    public string? dijagnoza { get; set; }
    public int? idVeterinara { get; set; } // (int?) - veterinar
    public string? Napomene {get; set;}

}
