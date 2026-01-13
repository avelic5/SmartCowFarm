using System;
using System.Globalization;
using System.Text;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.Data;

public class SmartCowFarmDatabaseContext : DbContext
{
    public SmartCowFarmDatabaseContext(DbContextOptions<SmartCowFarmDatabaseContext> options) : base(options)
    { }
    public DbSet<Korisnik> Korisnici { get; set; }
    public DbSet<Krava> Krave { get; set; }
    public DbSet<Muza> Muze { get; set; }
    public DbSet<OcitanjeSenzora> OcitanjaSenzora { get; set; }
    public DbSet<Senzor> Senzori { get; set; }
    public DbSet<Terapija> Terapije { get; set; }
    public DbSet<TerapijaAplikacije> TerapijeAplikacije { get; set; }
    public DbSet<Upozorenje> Upozorenja { get; set; }
    public DbSet<Zadatak> Zadaci { get; set; }
    public DbSet<ZdravstveniSlucaj> ZdravstveniSlucajevi { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Krava>(entity =>
        {
            entity.Property(e => e.PocetnaTezina)
                .HasPrecision(10, 2);

            entity.Property(e => e.ProsjecnaDnevnaProizvodnjaL)
                .HasPrecision(10, 2);

            entity.Property(e => e.TrenutnaProcijenjenaTezina)
                .HasPrecision(10, 2);
        });

        modelBuilder.Entity<Muza>(entity =>
        {
            entity.Property(e => e.KolicinaLitara)
                .HasPrecision(10, 2);

            entity.Property(e => e.ProsjecanProtokLMin)
                .HasPrecision(10, 2);

            entity.Property(e => e.TemperaturaMlijeka)
                .HasPrecision(5, 2);
        });

        modelBuilder.Entity<OcitanjeSenzora>(entity =>
        {
            entity.Property(e => e.Vrijednost)
                .HasPrecision(10, 3);
        });

        modelBuilder.Entity<Senzor>(entity =>
        {
            entity.Property(e => e.PragCriticalMax)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragCriticalMin)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragNormalnoMax)
                .HasPrecision(10, 3);

            entity.Property(e => e.PragNormalnoMin)
                .HasPrecision(10, 3);
        });

        modelBuilder.Entity<Terapija>(entity =>
        {
            entity.Property(e => e.Doza)
                .HasPrecision(10, 2);
        });


        modelBuilder.Entity<TerapijaAplikacije>(entity =>
        {
            entity.Property(e => e.PrimijenjenaKolicina)
                .HasPrecision(10, 2);
        });


        modelBuilder.Entity<Zadatak>(entity =>
        {
            entity.Property(e => e.StatusZadatka)
                .HasConversion(new ValueConverter<Models.Enums.StatusZadatka, string>(
                    v => v == Models.Enums.StatusZadatka.Obrada ? "U toku" : v.ToString(),
                    v => ParseStatusZadatka(v)));

            entity.Property(e => e.Prioritet)
                .HasConversion(new ValueConverter<Models.Enums.Prioritet, string>(
                    v => v.ToString(),
                    v => ParsePrioritet(v)));

            entity.Property(e => e.TipZadatka)
                .HasConversion(new ValueConverter<Models.Enums.TipZadatka, string>(
                    v => v.ToString(),
                    v => ParseTipZadatka(v)));
        });

        modelBuilder.Entity<Upozorenje>(entity =>
        {
            entity.Property(e => e.StatusUpozorenja)
                .HasConversion(new ValueConverter<Models.Enums.StatusUpozorenja, string>(
                    v => v.ToString(),
                    v => ParseStatusUpozorenja(v)));

            entity.Property(e => e.NivoUpozorenja)
                .HasConversion(new ValueConverter<Models.Enums.NivoUpozorenja, string>(
                    v => v.ToString(),
                    v => ParseNivoUpozorenja(v)));

            entity.Property(e => e.TipUpozorenja)
                .HasConversion(new ValueConverter<Models.Enums.TipUpozorenja, string>(
                    v => v.ToString(),
                    v => ParseTipUpozorenja(v)));
        });

        modelBuilder.Entity<OcitanjeSenzora>(entity =>
        {
            entity.Property(e => e.StatusOcitanja)
                .HasConversion<string>();
        });

        modelBuilder.Entity<ZdravstveniSlucaj>(entity =>
        {
            entity.Property(e => e.StatusSlucaja)
                .HasConversion(new ValueConverter<Models.Enums.StatusZdravlja, string>(
                    v => v.ToString(),
                    v => ParseStatusZdravlja(v)));
        });

        modelBuilder.Entity<Korisnik>(entity =>
        {
            entity.Property(e => e.RadnoMjesto)
                .HasConversion<string>();

            entity.Property(e => e.Odjel)
                .HasConversion<string>();

            entity.Property(e => e.StatusNaloga)
                .HasConversion<string>();
        });

        modelBuilder.Entity<Senzor>(entity =>
        {
            entity.Property(e => e.TipSenzora)
                .HasConversion<string>();
        });
    }

    private static string NormalizeEnumString(string? value)
    {
        return (value ?? string.Empty)
            .Trim()
            .Replace('_', ' ')
            .Replace("  ", " ");
    }

    private static string NormalizeEnumKey(string? value)
    {
        var normalized = NormalizeEnumString(value);
        normalized = RemoveDiacritics(normalized);
        normalized = normalized.Replace(" ", string.Empty);
        return normalized;
    }

    private static string RemoveDiacritics(string value)
    {
        if (string.IsNullOrEmpty(value)) return string.Empty;

        var normalizedFormD = value.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(normalizedFormD.Length);

        foreach (var ch in normalizedFormD)
        {
            var uc = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (uc != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(ch);
            }
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }

    private static Models.Enums.StatusZadatka ParseStatusZadatka(string? value)
    {
        var v = NormalizeEnumString(value);
        var key = NormalizeEnumKey(value);

        if (string.Equals(v, "U toku", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Obrada;
        if (string.Equals(key, "UToku", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Obrada;
        if (string.Equals(key, "Obrada", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Obrada;
        if (string.Equals(key, "Zakazan", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Kreiran;
        if (string.Equals(key, "Planiran", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Kreiran;
        if (string.Equals(key, "Kreiran", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Kreiran;
        if (string.Equals(key, "Zavrsen", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Zavrsen;
        if (string.Equals(key, "Zavrseno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Zavrsen;
        if (string.Equals(key, "Otkazan", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZadatka.Otkazan;

        return Enum.Parse<Models.Enums.StatusZadatka>(key, ignoreCase: true);
    }

    private static Models.Enums.NivoUpozorenja ParseNivoUpozorenja(string? value)
    {
        var v = NormalizeEnumString(value);
        var key = NormalizeEnumKey(value);

        if (string.Equals(key, "Status", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Status;
        if (string.Equals(key, "Upozorenje", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Upozorenje;
        if (string.Equals(key, "Kriticno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Kriticno;

        // legacy DB values
        if (string.Equals(key, "Visok", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Kriticno;
        if (string.Equals(key, "High", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Kriticno;
        if (string.Equals(key, "Kritican", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Kriticno;
        if (string.Equals(key, "Kriticno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Kriticno;
        if (string.Equals(key, "Srednji", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Upozorenje;
        if (string.Equals(key, "Srednje", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Upozorenje;
        if (string.Equals(key, "Nizak", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Status;
        if (string.Equals(key, "Low", StringComparison.OrdinalIgnoreCase)) return Models.Enums.NivoUpozorenja.Status;

        return Enum.Parse<Models.Enums.NivoUpozorenja>(key, ignoreCase: true);
    }

    private static Models.Enums.Prioritet ParsePrioritet(string? value)
    {
        var key = NormalizeEnumKey(value);

        if (string.Equals(key, "Nizak", StringComparison.OrdinalIgnoreCase)) return Models.Enums.Prioritet.Nizak;
        if (string.Equals(key, "Srednji", StringComparison.OrdinalIgnoreCase)) return Models.Enums.Prioritet.Srednji;
        if (string.Equals(key, "Visok", StringComparison.OrdinalIgnoreCase)) return Models.Enums.Prioritet.Visok;
        if (string.Equals(key, "Kritican", StringComparison.OrdinalIgnoreCase)) return Models.Enums.Prioritet.Kritican;

        return Enum.Parse<Models.Enums.Prioritet>(key, ignoreCase: true);
    }

    private static Models.Enums.StatusUpozorenja ParseStatusUpozorenja(string? value)
    {
        var v = NormalizeEnumString(value);
        var key = NormalizeEnumKey(value);

        // Expected enum values: Poslan, U_Obradi, Zavrsen
        if (string.Equals(key, "Poslan", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Poslan;
        if (string.Equals(key, "UObradi", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.U_Obradi;
        if (string.Equals(key, "Utoku", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.U_Obradi;
        if (string.Equals(key, "Zavrsen", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Zavrsen;

        // legacy / human-friendly statuses
        if (string.Equals(key, "Aktivno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.U_Obradi;
        if (string.Equals(key, "Otvoreno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.U_Obradi;
        if (string.Equals(key, "Neaktivno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Zavrsen;
        if (string.Equals(key, "Rijeseno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Zavrsen;
        if (string.Equals(key, "Zatvoreno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Zavrsen;
        if (string.Equals(key, "Novo", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusUpozorenja.Poslan;

        return Enum.TryParse<Models.Enums.StatusUpozorenja>(key, ignoreCase: true, out var parsed)
            ? parsed
            : Models.Enums.StatusUpozorenja.U_Obradi;
    }

    private static Models.Enums.TipZadatka ParseTipZadatka(string? value)
    {
        var key = NormalizeEnumKey(value);

        if (string.Equals(key, "Dnevni", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.Dnevni;
        if (string.Equals(key, "Veterinarski", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.Veterinarski;
        if (string.Equals(key, "UpozorenjeSenzora", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.UpozorenjeSenzora;
        if (string.Equals(key, "Manuelni", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.Manuelni;

        // legacy DB values
        if (string.Equals(key, "Zdravstveni", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.Veterinarski;
        if (string.Equals(key, "Odrzavanje", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipZadatka.Dnevni;

        // last resort: unknown task types become Manuelni
        return Enum.TryParse<Models.Enums.TipZadatka>(key, ignoreCase: true, out var parsed)
            ? parsed
            : Models.Enums.TipZadatka.Manuelni;
    }

    private static Models.Enums.TipUpozorenja ParseTipUpozorenja(string? value)
    {
        var key = NormalizeEnumKey(value);

        if (string.Equals(key, "Senzor", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Manuelni", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Manuelni;
        if (string.Equals(key, "Sistemski", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Sistemski;

        // legacy / specific sensor types stored directly
        if (string.Equals(key, "Temperatura", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Temp", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Vlaznost", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Puls", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Pokret", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;
        if (string.Equals(key, "Senzorsko", StringComparison.OrdinalIgnoreCase)) return Models.Enums.TipUpozorenja.Senzor;

        // safest default: treat unknown as sensor alert so endpoints don't 500
        return Models.Enums.TipUpozorenja.Senzor;
    }

    private static Models.Enums.StatusZdravlja ParseStatusZdravlja(string? value)
    {
        var v = NormalizeEnumString(value);
        var key = NormalizeEnumKey(value);

        if (string.Equals(key, "Aktivna", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Aktivna;
        if (string.Equals(key, "Aktivan", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Aktivna;
        if (string.Equals(key, "Neaktivna", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;
        if (string.Equals(key, "Neaktivan", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;
        if (string.Equals(key, "PodNadzorom", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.PodNadzorom;
        if (string.Equals(v, "Pod nadzorom", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.PodNadzorom;
        if (string.Equals(key, "Prodana", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Prodana;

        // legacy DB values (case closed/resolved)
        if (string.Equals(v, "Rijesen", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;
        if (string.Equals(v, "Riješen", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;
        if (string.Equals(v, "Zatvoren", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;
        if (string.Equals(v, "Zatvoreno", StringComparison.OrdinalIgnoreCase)) return Models.Enums.StatusZdravlja.Neaktivna;

        return Enum.Parse<Models.Enums.StatusZdravlja>(key, ignoreCase: true);
    }
}
