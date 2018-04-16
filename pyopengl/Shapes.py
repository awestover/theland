"""
Classes for 

The Ground

Obstacles and subclasses:
The Cube
The Asteroids

"""


from basics import *

import pygame
from pygame.locals import *

from OpenGL.GL import *
from OpenGL.GLU import *

import numpy as np
from numpy import pi, sin, cos, sqrt

import random
from random import random as rand
from pdb import set_trace as tr


""" 
the ground
maybe have this be a limiting value later
if people go beneath the ground they die?
"""
class Ground():
    def __init__(self):
        self.verts = (
            (-10, -3, 20),
            (10, -3, 20),
            (-10, -3, -300),
            (10, -3, -300)
            )
        self.color = (rand(),rand(),rand())

    def draw(self):
        glBegin(GL_QUADS)
        for vertex in self.verts:
            glColor3fv(self.color)
            glVertex3fv(vertex)
        glEnd()



"""
super class for any obstacle
"""
class Obstacle():
    def __init__(self, pos=(0,0,0)):
        self.pos = pos

    def scramble_pos(self,k):
        self.pos = ((rand()-0.5)*k,(rand()-0.5)*k,(rand()-0.5)*k)


class Cube(Obstacle):
    def __init__(self, pos=(0,0,0)):
        Obstacle.__init__(self, pos=pos)
        self.base_verticies = general_vertices[:]
        self.edges = edges[:]

    def draw(self):
        glBegin(GL_LINES)
        for edge in self.edges:
           for vertex in edge:
                glVertex3fv(addt(self.base_verticies[vertex], self.pos))
        glEnd()

    def hit_person(self, pos2):
        # does not count
        return False

class Asteroid(Obstacle):
    def __init__(self, pos=(0,0,0), size=1):
        Obstacle.__init__(self, pos=pos)

        if rand()<0.5:
            self.skeleton = True
        else:
            self.skeleton = False

        ths = np.linspace(0, 2*pi, 8)
        phs = np.linspace(0,   pi, 8)
        rho_avg = size
        rho_dev = 0.004*size

        self.base_verticies = []
        for thi in range(0, len(ths)):
            self.base_verticies.append([])
            for phi in range(0, len(phs)):
                rho = rho_avg + rho_dev*np.random.rand()
                x = rho*sin(phs[phi])*cos(ths[thi])
                y = rho*sin(phs[phi])*sin(ths[thi])
                z = rho*cos(phs[phi])
                self.base_verticies[-1].append((x,y,z))


    def color(self, thi, phi):
        r = thi/len(self.base_verticies)
        g = phi/len(self.base_verticies[0])
        b = (thi+phi)/(len(self.base_verticies[0])+len(self.base_verticies))
        return (r, g, b)

    def draw(self):
        if not self.skeleton:
            glBegin(GL_TRIANGLES)
        else:
            glBegin(GL_LINES)

        for thi in range(0, len(self.base_verticies)):
            for phi in range(0, len(self.base_verticies[0])):
                glColor(self.color(phi, thi))
                # glColor((1,1,1))

                glVertex3fv(addt(self.base_verticies[thi][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[thi][(phi+1)%len(self.base_verticies[0])], self.pos))

                glColor(self.color(phi, thi))
                # glColor((0,0,0))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[thi][(phi+1)%len(self.base_verticies[0])], self.pos))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][(phi+1)%len(self.base_verticies[0])], self.pos))

        glEnd()


    def hit_person(self, pos2):
        # euclidean distance for now
        dist = 0
        for i in range(0, 2):
            dist += (self.pos[i] - pos2[i])**2
        dist = sqrt(dist)

        critical_distance = 2

        print(dist)

        return dist < critical_distance

