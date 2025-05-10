using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepo) : BaseApiController {

  [HttpGet]
  public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() {
    var users = await userRepo.GetMembersAsync();
    return Ok(users);
  }

  [HttpGet("{username}")]
  public async Task<ActionResult<MemberDto>> GetUser(string username) {
    var user = await userRepo.GetMemberAsync(username);

    if (user == null) return NotFound();
    
    return user;
  }

}
