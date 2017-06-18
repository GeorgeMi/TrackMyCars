using AzureDataAccess;
using DataTransferObject;
using Entities;
using System.Collections.Generic;
using System.Linq;

namespace BusinessLogic
{
    /// <summary>
    /// 
    /// </summary>
    public class DriverCarLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objDataAccess"></param>
        public DriverCarLogic(IAzureDataAccess objDataAccess)
        {
            // Primesc obiectul, nu e treaba CategoryLogic ce dataAccess se foloseste
            // Unity are grija de dependency injection
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<DriverCarDTO> GetAllCarsDrivers()
        {
            var listCarsDrivers = _dataAccess.DriverCarRepository.GetAll().ToList();

            return listCarsDrivers.Select(u => new DriverCarDTO
            {
                CarID = u.CarID,
                DriverCarID = u.DriverCarID,
                UserID = u.UserID                
            }).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<DriverCarDTO> GetAllDriversForCar(int carId)
        {
            var listCarsDrivers = _dataAccess.DriverCarRepository.FindAllBy(c => c.CarID == carId).ToList();

            return listCarsDrivers.Select(u => new DriverCarDTO
            {
                CarID = u.CarID,
                DriverCarID = u.DriverCarID,
                UserID = u.UserID
            }).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<DriverCarDTO> GetAllCarsForDriver(int userId)
        {
            var listCarsDrivers = _dataAccess.DriverCarRepository.FindAllBy(c => c.UserID == userId).ToList();

            return listCarsDrivers.Select(u => new DriverCarDTO
            {
                CarID = u.CarID,
                DriverCarID = u.DriverCarID,
                UserID = u.UserID
            }).ToList();
        }

        /// <summary>
        /// </summary>
        /// <param name="driverCarDTO"></param>
        public void AddCarDriver(DriverCarDTO driverCarDTO)
        {
            var driversCar = new DriversCar
            {
                CarID = driverCarDTO.CarID,
                DriverCarID = driverCarDTO.DriverCarID,
                UserID = driverCarDTO.UserID
            };

            _dataAccess.DriverCarRepository.Add(driversCar);
        }

        /// <summary>
        /// </summary>
        /// <param name="driverCarId"></param>
        public void DeleteDriversCar(int driverCarId)
        {
            var driverCar = _dataAccess.DriverCarRepository.FindFirstBy(u => u.DriverCarID == driverCarId);
            _dataAccess.DriverCarRepository.Delete(driverCar);
        }
    }
}
