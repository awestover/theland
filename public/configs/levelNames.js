function getRank(lvl)
{
  if(lvl == 0)
  {
    return "none";
  }
  if (lvl == 1)
  {
    return "beginner";
  }
  else if(lvl == 2)
  {
    return "sketchy";
  }
  else if (lvl == 3)
  {
    return "artist";
  }
  else if (lvl < 6)
  {
    return "glider";
  }
  else if (lvl == 6)
  {
    return "pro";
  }
  else if (lvl < 50) {
    return "lander"
  }
  else {
    return "hacker";
  }
}
