University of British Columbia, Vancouver
Winter 2017 Term 2
CPSC 314 Computer Graphics
Assignment #6
Student Name: Zafer Cavdar
Student ID: 51503035
CS Username: g0o1b

For creative part (e):
  1- I implemented Phong model in localShade function using ambient color and surface color
  with ka, kd, ks weights. n is taken as 10. New uniform variables are introduced.

  2- I also implemented refraction in rayCast function. I calculated refracted ray with refraction
  index 1.0 / 1.4. Then, I found the second intersection of the sphere and refracted ray. I calculated
  second refraction from sphere to air and raycast2 function is called with secondRefractedRay.
  Refraction color constant is set as 0.1 for all spheres.
