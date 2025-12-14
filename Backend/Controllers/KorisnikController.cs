using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly SmartCowFarmDatabaseContext baza;
        public KorisnikController(SmartCowFarmDatabaseContext context)
        {
            baza = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Korisnik>>> DajKorisnike()
        {
            return Ok(await baza.Korisnici.ToListAsync());
        }
    }
}
