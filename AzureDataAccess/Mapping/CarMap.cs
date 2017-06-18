using System.Data.Entity.ModelConfiguration;
using Entities;

namespace AzureDataAccess.Mapping
{
    public class CarMap : EntityTypeConfiguration<Car>
    {
        public CarMap()
        {
            // Primary Key
            this.HasKey(t => t.CarID);

            // Properties
            this.Property(t => t.RegNo)
                .IsRequired()
                .HasMaxLength(250);

            this.Property(t => t.Brand)
                .IsRequired()
                .HasMaxLength(250);

            // Table & Column Mappings
            this.ToTable("Cars");
            this.Property(t => t.CarID).HasColumnName("CarID");
            this.Property(t => t.RegNo).HasColumnName("RegNo");
            this.Property(t => t.Year).HasColumnName("Year");
            this.Property(t => t.KmNo).HasColumnName("KmNo");
            this.Property(t => t.Brand).HasColumnName("Brand");
        }
    }
}
