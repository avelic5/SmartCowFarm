using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InicijalnaMigracija : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    IdKorisnika = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ime = table.Column<string>(type: "text", nullable: false),
                    Prezime = table.Column<string>(type: "text", nullable: false),
                    RadnoMjesto = table.Column<string>(type: "text", nullable: false),
                    KorisnickoIme = table.Column<string>(type: "text", nullable: false),
                    HashLozinke = table.Column<string>(type: "text", nullable: false),
                    Telefon = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DatumZaposlenja = table.Column<DateOnly>(type: "date", nullable: false),
                    Odjel = table.Column<string>(type: "text", nullable: false),
                    StatusNaloga = table.Column<string>(type: "text", nullable: false),
                    Napomene = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.IdKorisnika);
                });

            migrationBuilder.CreateTable(
                name: "Krave",
                columns: table => new
                {
                    IdKrave = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OznakaKrave = table.Column<string>(type: "text", nullable: false),
                    Rasa = table.Column<string>(type: "text", nullable: false),
                    DatumRodjenja = table.Column<DateOnly>(type: "date", nullable: false),
                    DatumDolaska = table.Column<DateOnly>(type: "date", nullable: false),
                    PorijekloTip = table.Column<string>(type: "text", nullable: false),
                    IdMajke = table.Column<int>(type: "integer", nullable: true),
                    MajkaKravaIdKrave = table.Column<int>(type: "integer", nullable: true),
                    TrenutniStatus = table.Column<int>(type: "integer", nullable: false),
                    PocetnaTezina = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    TrenutnaProcijenjenaTezina = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    OpisIzgleda = table.Column<string>(type: "text", nullable: false),
                    ProsjecnaDnevnaProizvodnjaL = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Napomene = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Krave", x => x.IdKrave);
                    table.ForeignKey(
                        name: "FK_Krave_Krave_MajkaKravaIdKrave",
                        column: x => x.MajkaKravaIdKrave,
                        principalTable: "Krave",
                        principalColumn: "IdKrave");
                });

            migrationBuilder.CreateTable(
                name: "Senzori",
                columns: table => new
                {
                    IdSenzora = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TipSenzora = table.Column<string>(type: "text", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "text", nullable: false),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: false),
                    PragNormalnoMin = table.Column<decimal>(type: "numeric(10,3)", precision: 10, scale: 3, nullable: false),
                    PragNormalnoMax = table.Column<decimal>(type: "numeric(10,3)", precision: 10, scale: 3, nullable: false),
                    PragCriticalMin = table.Column<decimal>(type: "numeric(10,3)", precision: 10, scale: 3, nullable: false),
                    PragCriticalMax = table.Column<decimal>(type: "numeric(10,3)", precision: 10, scale: 3, nullable: false),
                    DatumKalibracije = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Senzori", x => x.IdSenzora);
                });

            migrationBuilder.CreateTable(
                name: "Muze",
                columns: table => new
                {
                    IdMuze = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdKrave = table.Column<int>(type: "integer", nullable: false),
                    Datum = table.Column<DateOnly>(type: "date", nullable: false),
                    VrijemePocetka = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    VrijemeZavrsretka = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    KolicinaLitara = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ProsjecanProtokLMin = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    TemperaturaMlijeka = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    NacinUnosa = table.Column<string>(type: "text", nullable: false),
                    OznakaOdstupanja = table.Column<string>(type: "text", nullable: false),
                    Napomena = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Muze", x => x.IdMuze);
                    table.ForeignKey(
                        name: "FK_Muze_Krave_IdKrave",
                        column: x => x.IdKrave,
                        principalTable: "Krave",
                        principalColumn: "IdKrave",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Zadaci",
                columns: table => new
                {
                    IdZadatka = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NazivZadatka = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: false),
                    Prioritet = table.Column<string>(type: "text", nullable: false),
                    TipZadatka = table.Column<string>(type: "text", nullable: false),
                    IdKrave = table.Column<int>(type: "integer", nullable: true),
                    KravaIdKrave = table.Column<int>(type: "integer", nullable: true),
                    Izvor = table.Column<string>(type: "text", nullable: false),
                    IdKreator = table.Column<int>(type: "integer", nullable: false),
                    KreatorIdKorisnika = table.Column<int>(type: "integer", nullable: false),
                    IdIzvrsilac = table.Column<int>(type: "integer", nullable: true),
                    IzvrsilacIdKorisnika = table.Column<int>(type: "integer", nullable: true),
                    RokIzvrsenja = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VrijemePocetka = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    VrijemeZavrsEtka = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StatusZadatka = table.Column<string>(type: "text", nullable: false),
                    UtroseniResursiOpis = table.Column<string>(type: "text", nullable: false),
                    Napomene = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zadaci", x => x.IdZadatka);
                    table.ForeignKey(
                        name: "FK_Zadaci_Korisnici_IzvrsilacIdKorisnika",
                        column: x => x.IzvrsilacIdKorisnika,
                        principalTable: "Korisnici",
                        principalColumn: "IdKorisnika");
                    table.ForeignKey(
                        name: "FK_Zadaci_Korisnici_KreatorIdKorisnika",
                        column: x => x.KreatorIdKorisnika,
                        principalTable: "Korisnici",
                        principalColumn: "IdKorisnika",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Zadaci_Krave_KravaIdKrave",
                        column: x => x.KravaIdKrave,
                        principalTable: "Krave",
                        principalColumn: "IdKrave");
                });

            migrationBuilder.CreateTable(
                name: "ZdravstveniSlucajevi",
                columns: table => new
                {
                    IdSlucaja = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdKrave = table.Column<int>(type: "integer", nullable: false),
                    KravaIdKrave = table.Column<int>(type: "integer", nullable: false),
                    DatumOtvaranja = table.Column<DateOnly>(type: "date", nullable: false),
                    VrijemeOtvaranja = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    RazlogOtvaranja = table.Column<string>(type: "text", nullable: false),
                    OpisSimptoma = table.Column<string>(type: "text", nullable: false),
                    AiTipAnomalije = table.Column<string>(type: "text", nullable: false),
                    AiNivoRizika = table.Column<string>(type: "text", nullable: false),
                    Dijagnoza = table.Column<string>(type: "text", nullable: false),
                    StatusSlucaja = table.Column<string>(type: "text", nullable: false),
                    IdVeterinara = table.Column<int>(type: "integer", nullable: true),
                    VeterinarIdKorisnika = table.Column<int>(type: "integer", nullable: true),
                    DatumZatvaranja = table.Column<DateOnly>(type: "date", nullable: false),
                    Napomene = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZdravstveniSlucajevi", x => x.IdSlucaja);
                    table.ForeignKey(
                        name: "FK_ZdravstveniSlucajevi_Korisnici_VeterinarIdKorisnika",
                        column: x => x.VeterinarIdKorisnika,
                        principalTable: "Korisnici",
                        principalColumn: "IdKorisnika");
                    table.ForeignKey(
                        name: "FK_ZdravstveniSlucajevi_Krave_KravaIdKrave",
                        column: x => x.KravaIdKrave,
                        principalTable: "Krave",
                        principalColumn: "IdKrave",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OcitanjaSenzora",
                columns: table => new
                {
                    IdOcitanja = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdSenzora = table.Column<int>(type: "integer", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Vrijednost = table.Column<decimal>(type: "numeric(10,3)", precision: 10, scale: 3, nullable: false),
                    StatusOcitanja = table.Column<string>(type: "text", nullable: false),
                    Napomena = table.Column<string>(type: "text", nullable: false),
                    IdOsobeReagovala = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcitanjaSenzora", x => x.IdOcitanja);
                    table.ForeignKey(
                        name: "FK_OcitanjaSenzora_Senzori_IdSenzora",
                        column: x => x.IdSenzora,
                        principalTable: "Senzori",
                        principalColumn: "IdSenzora",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Upozorenja",
                columns: table => new
                {
                    IdUpozorenja = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TipUpozorenja = table.Column<string>(type: "text", nullable: false),
                    NivoUpozorenja = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: false),
                    RazlogAktiviranja = table.Column<string>(type: "text", nullable: false),
                    VrijemeDetekcije = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IdKrave = table.Column<int>(type: "integer", nullable: true),
                    IdSenzora = table.Column<int>(type: "integer", nullable: true),
                    IdZadatka = table.Column<int>(type: "integer", nullable: true),
                    KanaliSlani = table.Column<string>(type: "text", nullable: false),
                    VrijemePrveReakcije = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IdOsobaPreuzela = table.Column<int>(type: "integer", nullable: true),
                    StatusUpozorenja = table.Column<string>(type: "text", nullable: false),
                    Napomena = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upozorenja", x => x.IdUpozorenja);
                    table.ForeignKey(
                        name: "FK_Upozorenja_Krave_IdKrave",
                        column: x => x.IdKrave,
                        principalTable: "Krave",
                        principalColumn: "IdKrave");
                    table.ForeignKey(
                        name: "FK_Upozorenja_Senzori_IdSenzora",
                        column: x => x.IdSenzora,
                        principalTable: "Senzori",
                        principalColumn: "IdSenzora");
                    table.ForeignKey(
                        name: "FK_Upozorenja_Zadaci_IdZadatka",
                        column: x => x.IdZadatka,
                        principalTable: "Zadaci",
                        principalColumn: "IdZadatka");
                });

            migrationBuilder.CreateTable(
                name: "Terapije",
                columns: table => new
                {
                    IdTerapije = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdSlucaja = table.Column<int>(type: "integer", nullable: false),
                    ZdravstveniSlucajIdSlucaja = table.Column<int>(type: "integer", nullable: false),
                    NazivLijeka = table.Column<string>(type: "text", nullable: false),
                    Doza = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    JedinicaMjere = table.Column<string>(type: "text", nullable: false),
                    TrajanjeDana = table.Column<int>(type: "integer", nullable: false),
                    Ucestalost = table.Column<string>(type: "text", nullable: false),
                    DatumPocetka = table.Column<DateOnly>(type: "date", nullable: false),
                    DatumKraja = table.Column<DateOnly>(type: "date", nullable: false),
                    Uputstvo = table.Column<string>(type: "text", nullable: false),
                    Napomena = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Terapije", x => x.IdTerapije);
                    table.ForeignKey(
                        name: "FK_Terapije_ZdravstveniSlucajevi_ZdravstveniSlucajIdSlucaja",
                        column: x => x.ZdravstveniSlucajIdSlucaja,
                        principalTable: "ZdravstveniSlucajevi",
                        principalColumn: "IdSlucaja",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TerapijeAplikacije",
                columns: table => new
                {
                    IdAplikacije = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdTerapije = table.Column<int>(type: "integer", nullable: false),
                    DatumVrijeme = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PrimijenjenaKolicina = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    IdIzvrsilac = table.Column<int>(type: "integer", nullable: false),
                    IzvrsilacIdKorisnika = table.Column<int>(type: "integer", nullable: false),
                    Napomena = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TerapijeAplikacije", x => x.IdAplikacije);
                    table.ForeignKey(
                        name: "FK_TerapijeAplikacije_Korisnici_IzvrsilacIdKorisnika",
                        column: x => x.IzvrsilacIdKorisnika,
                        principalTable: "Korisnici",
                        principalColumn: "IdKorisnika",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TerapijeAplikacije_Terapije_IdTerapije",
                        column: x => x.IdTerapije,
                        principalTable: "Terapije",
                        principalColumn: "IdTerapije",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Krave_MajkaKravaIdKrave",
                table: "Krave",
                column: "MajkaKravaIdKrave");

            migrationBuilder.CreateIndex(
                name: "IX_Muze_IdKrave",
                table: "Muze",
                column: "IdKrave");

            migrationBuilder.CreateIndex(
                name: "IX_OcitanjaSenzora_IdSenzora",
                table: "OcitanjaSenzora",
                column: "IdSenzora");

            migrationBuilder.CreateIndex(
                name: "IX_Terapije_ZdravstveniSlucajIdSlucaja",
                table: "Terapije",
                column: "ZdravstveniSlucajIdSlucaja");

            migrationBuilder.CreateIndex(
                name: "IX_TerapijeAplikacije_IdTerapije",
                table: "TerapijeAplikacije",
                column: "IdTerapije");

            migrationBuilder.CreateIndex(
                name: "IX_TerapijeAplikacije_IzvrsilacIdKorisnika",
                table: "TerapijeAplikacije",
                column: "IzvrsilacIdKorisnika");

            migrationBuilder.CreateIndex(
                name: "IX_Upozorenja_IdKrave",
                table: "Upozorenja",
                column: "IdKrave");

            migrationBuilder.CreateIndex(
                name: "IX_Upozorenja_IdSenzora",
                table: "Upozorenja",
                column: "IdSenzora");

            migrationBuilder.CreateIndex(
                name: "IX_Upozorenja_IdZadatka",
                table: "Upozorenja",
                column: "IdZadatka");

            migrationBuilder.CreateIndex(
                name: "IX_Zadaci_IzvrsilacIdKorisnika",
                table: "Zadaci",
                column: "IzvrsilacIdKorisnika");

            migrationBuilder.CreateIndex(
                name: "IX_Zadaci_KravaIdKrave",
                table: "Zadaci",
                column: "KravaIdKrave");

            migrationBuilder.CreateIndex(
                name: "IX_Zadaci_KreatorIdKorisnika",
                table: "Zadaci",
                column: "KreatorIdKorisnika");

            migrationBuilder.CreateIndex(
                name: "IX_ZdravstveniSlucajevi_KravaIdKrave",
                table: "ZdravstveniSlucajevi",
                column: "KravaIdKrave");

            migrationBuilder.CreateIndex(
                name: "IX_ZdravstveniSlucajevi_VeterinarIdKorisnika",
                table: "ZdravstveniSlucajevi",
                column: "VeterinarIdKorisnika");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Muze");

            migrationBuilder.DropTable(
                name: "OcitanjaSenzora");

            migrationBuilder.DropTable(
                name: "TerapijeAplikacije");

            migrationBuilder.DropTable(
                name: "Upozorenja");

            migrationBuilder.DropTable(
                name: "Terapije");

            migrationBuilder.DropTable(
                name: "Senzori");

            migrationBuilder.DropTable(
                name: "Zadaci");

            migrationBuilder.DropTable(
                name: "ZdravstveniSlucajevi");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "Krave");
        }
    }
}
