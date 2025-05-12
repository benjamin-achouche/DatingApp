using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
  public async Task<MemberDto?> GetMemberAsync(string username) {
    return await context.Users
      .Where(u => u.UserName == username)
      .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
      .SingleOrDefaultAsync();
  }

  public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams) {
    var query = context.Users
      .AsQueryable()
      .Where(u => u.UserName != userParams.CurrentUsername)
      .Where(u => u.DateOfBirth < DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge)))
      .Where(u => u.DateOfBirth > DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1)))
      .Where(u => userParams.Gender == null || u.Gender == userParams.Gender);

    query = userParams.OrderBy switch {
      "created" => query.OrderByDescending(x => x.Created),
      _ => query.OrderByDescending(x => x.LastActive)
    };

    var members = query.ProjectTo<MemberDto>(mapper.ConfigurationProvider);

    return await PagedList<MemberDto>.CreateAsync(members, userParams.PageNumber, userParams.PageSize);
  }

  public async Task<AppUser?> GetUserByIdAsync(int id) {
    return await context.Users.FindAsync(id);
  }

  public async Task<AppUser?> GetUserByUsernameAsync(string username) {
    return await context.Users
      .Include(u => u.Photos)
      .SingleOrDefaultAsync(u => u.UserName == username);
  }

  public async Task<IEnumerable<AppUser>> GetUsersAsync() {
    return await context.Users
      .Include(u => u.Photos)
      .ToListAsync();
  }

  public async Task<bool> SaveChangesAsync() {
    return await context.SaveChangesAsync() > 0;
  }

  public void Update(AppUser user) {
    context.Entry(user).State = EntityState.Modified;
  }
}
