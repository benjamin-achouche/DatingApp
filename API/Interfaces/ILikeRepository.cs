using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikeRepository {

  Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
  Task<PagedList<MemberDto>> GetUsersLiked(LikesParams likesParams);
  Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId);
  void AddLike(UserLike like);
  void DeleteLike(UserLike like);
  Task<bool> SaveChangesAsync();

}
