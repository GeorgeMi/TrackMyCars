using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Entities;

namespace AzureDataAccess.Mapping
{
    public class CarsUtilityMap : EntityTypeConfiguration<CarsUtility>
    {
        public CarsUtilityMap()
        {
            // Primary Key
            this.HasKey(t => t.CarUtilityID);

            // Properties
            this.Property(t => t.CarUtilityID)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.Description)
                .HasMaxLength(250);

            // Table & Column Mappings
            this.ToTable("CarsUtilities");
            this.Property(t => t.CarUtilityID).HasColumnName("CarUtilityID");
            this.Property(t => t.UtilityID).HasColumnName("UtilityID");
            this.Property(t => t.CarID).HasColumnName("CarID");
            this.Property(t => t.StartedDate).HasColumnName("StartedDate");
            this.Property(t => t.StartedKmNo).HasColumnName("StartedKmNo");
            this.Property(t => t.Description).HasColumnName("Description");

            // Relationships
            this.HasRequired(t => t.Car)
                .WithMany(t => t.CarsUtilities)
                .HasForeignKey(d => d.CarID);
            this.HasRequired(t => t.Utility)
                .WithMany(t => t.CarsUtilities)
                .HasForeignKey(d => d.UtilityID);

        }
    }
}
