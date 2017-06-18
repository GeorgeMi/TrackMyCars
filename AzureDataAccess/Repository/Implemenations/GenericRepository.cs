/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 * Role:
 * Repository implementation. 
 *
 * History:
 * 09.02.2016    Miron George       Created class.
 */

using System;
using System.Linq;
using System.Linq.Expressions;
using AzureDataAccess.Context;
using AzureDataAccess.Repository.Interfaces;

namespace AzureDataAccess.Repository.Implemenations
{
    /// <summary>
    /// Implementare interfata generala 
    /// </summary>
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        #region Public Members
        public TrackMyCarsContext Context { get; set; }
        #endregion

        #region Constructor
        /// <summary>
        /// Constructor
        /// </summary>
        public GenericRepository(TrackMyCarsContext context)
        {
            Context = context;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Adaugare entitate
        /// </summary>
        /// <param name="entity">entitatea care va fi adaugata</param>
        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
            Context.SaveChanges();
        }

        /// <summary>
        /// Numarare entitati
        /// </summary>
        public int Count()
        {
            return Context.Set<T>().Count();
        }

        /// <summary>
        /// Stergere entitate
        /// </summary>
        /// <param name="entity">entitatea care va fi stearsa</param>
        public void Delete(T entity)
        {
            Context.Set<T>().Remove(entity);
            Context.SaveChanges();
        }

        /// <summary>
        /// Stergere entitati
        /// </summary>
        /// <param name="entities">lista de entitati care vor fi sterse</param>
        public virtual void Delete(IQueryable<T> entities)
        {
            foreach (var entity in entities.ToList())
            {
                Context.Set<T>().Remove(entity);
            }
            Context.SaveChanges();
        }

        /// <summary>
        /// Preluarea tuturor entitatilor
        /// </summary>
        public IQueryable<T> GetAll()
        {
            return Context.Set<T>();
        }

        /// <summary>
        /// Gasirea entitatilor care respecta o anumita regula
        /// </summary>
        /// <param name="predicate">regula pe baza careia se cauta entitatile</param>
        public virtual IQueryable<T> FindAllBy(Expression<Func<T, bool>> predicate)
        {
            return Context.Set<T>().Where(predicate);
        }

        /// <summary>
        /// Gasirea primei entitati care respecta o anumita regula
        /// </summary>
        /// <param name="predicate">egula pe baza careia se cauta entitatea</param>
        /// <returns></returns>
        public virtual T FindFirstBy(Expression<Func<T, bool>> predicate)
        {
            return Context.Set<T>().FirstOrDefault(predicate);
        }

        /// <summary>
        /// Actualizarea unei entitati
        /// </summary>
        /// <param name="entity">entitatea care urmeaza sa fie actualizata</param>
        public void Update(T entity)
        {
            Context.Entry<T>(entity).State = System.Data.Entity.EntityState.Modified;
            Context.SaveChanges();
        }

        #endregion
    }
}
