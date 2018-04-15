"""
usefull functions and constants for a 3D game
"""

general_vertices = (
(1, -1, -1),
(1, 1, -1),
(-1, 1, -1),
(-1, -1, -1),
(1, -1, 1),
(1, 1, 1),
(-1, -1, 1),
(-1, 1, 1)
)

edges = (
(0,1),
(0,3),
(0,4),
(2,1),
(2,3),
(2,7),
(6,3),
(6,4),
(6,7),
(5,1),
(5,4),
(5,7)
)



def addt(a, b):
	c = [a[i]+b[i] for i in range(0, len(a))]
	return tuple(c)



