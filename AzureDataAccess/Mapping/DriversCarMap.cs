using System.Data.Entity.ModelConfiguration;
using Entities;

namespace AzureDataAccess.Mapping
{
    public class DriversCarMap : EntityTypeConfiguration<DriversCar>
    {
        public DriversCarMap()
        {
            // Primary Key
            this.HasKey(t => t.DriverCarID);

            // Properties
            // Table & Column Mappings
            this.ToTable("DriversCars");
            this.Property(t => t.DriverCarID).HasColumnName("DriverCarID");
            this.Property(t => t.UserID).HasColumnName("UserID");
            this.Property(t => t.CarID).HasColumnName("CarID");

            // Relationships
            this.HasRequired(t => t.Car)
                .WithMany(t => t.DriversCars)
                .HasForeignKey(d => d.UserID);
            this.HasRequired(t => t.User)
                .WithMany(t => t.DriversCars)
                .HasForeignKey(d => d.UserID);

        }
    }
}
