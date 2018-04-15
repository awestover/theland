"""
basic 3d game
"""

import pygame
from pygame.locals import *

from OpenGL.GL import *
from OpenGL.GLU import *

from basics import *

import numpy as np
from numpy import pi, sin, cos

import random
from random import random as rand
from pdb import set_trace as tr

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

class Cube():
    def __init__(self, pos=(0,0,0)):
        self.base_verticies = general_vertices[:]
        self.pos = pos
        self.edges = edges[:]

    def draw(self):
        glBegin(GL_LINES)
        for edge in self.edges:
           for vertex in edge:
                glVertex3fv(addt(self.base_verticies[vertex], self.pos))
        glEnd()

    def scramble_pos(self,k):
        self.pos = ((rand()-0.5)*k,(rand()-0.5)*k,(rand()-0.5)*k)

class Asteroid():
    def __init__(self, pos=(0,0,0), size=1):
        self.pos = pos

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


    def scramble_pos(self,k):
        self.pos = ((rand()-0.5)*k,(rand()-0.5)*k,(rand()-0.5)*k)


def main():
    pygame.init()
    display = (1200,800)
    pygame.display.set_mode(display, DOUBLEBUF|OPENGL)

    gluPerspective(45, (display[0]/display[1]), 1.0, 30.0)
    glClearColor(rand(),rand(),rand(),rand())
    glTranslatef(0,0,-20.0)

    ground = Ground()

    cubes = [Cube((0,0,0))]
    for i in range(0, random.randint(1,10)):
        cubes.append(Asteroid(((rand()-0.5)*10,(rand()-0.5)*10,(rand()-0.5)*10), size=rand()))

    done = 10

    while done > 0:
        keys = pygame.key.get_pressed()  #checking pressed keys
        
        if keys[pygame.K_a]:
            glRotatef(5, 0, 1, 0)
        if keys[pygame.K_d]:
            glRotatef(5, 0, -1, 0)

        if keys[pygame.K_w]:
            glRotatef(5, 0, 0, 1)
        if keys[pygame.K_s]:
            glRotatef(5, 0, 0, -1)

        # if keys[pygame.K_g]:
        #     glRotatef(5, 1, 0, 0)
        # if keys[pygame.K_h]:
        #     glRotatef(5, -1, 0, 0)

        if keys[pygame.K_LEFT]:
            glTranslatef(0.1,0,0)
        if keys[pygame.K_RIGHT]:
            glTranslatef(-0.1,0,0)

        if keys[pygame.K_UP]:
            glTranslatef(0,-0.1,0)
        if keys[pygame.K_DOWN]:
            glTranslatef(0,0.1,0)

        # if keys[pygame.K_c]:
        #     glTranslatef(0,0,0.1)
        # if keys[pygame.K_z]:
        #     glTranslatef(0,0,-0.1)


        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key==pygame.K_q:
                    pygame.quit()
                    quit()
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT)
        
        ground.draw()
        for cube in cubes:
            cube.draw()

        glTranslatef(0,0,0.3)


        x = glGetDoublev(GL_MODELVIEW_MATRIX)

        camera_x = x[3][0]
        camera_y = x[3][1]
        camera_z = x[3][2]

        if camera_z < 2:
            done-=1
            glClearColor(rand(),rand(),rand(),rand())
            glTranslatef(0,0,-20.0)
            for cube in cubes:
                cube.scramble_pos(10)

        pygame.display.flip()
        pygame.time.wait(10)


if __name__ == "__main__":
    main()

