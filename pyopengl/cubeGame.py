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

from pdb import set_trace as tr

class Cube():
    def __init__(self, pos=(0,0,0)):
        self.base_verticies = general_vertices[:]
        self.pos = pos
        self.edges = edges[:]

    def draw(self):
        glBegin(GL_LINES)
        try:
            for edge in self.edges:
               for vertex in edge:
                    glVertex3fv(addt(self.base_verticies[vertex], self.pos))
        except:
            tr()
        glEnd()

class Asteroid():
    def __init__(self, pos=(0,0,0), size=1):
        self.pos = pos

        ths = np.linspace(0, 2*pi, 8)
        phs = np.linspace(0,   pi, 8)
        rho_avg = size
        rho_dev = 0.4*size

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
        glBegin(GL_TRIANGLES)

        for thi in range(0, len(self.base_verticies)):
            for phi in range(0, len(self.base_verticies[0])):
                glColor(self.color(phi, thi))
                
                glVertex3fv(addt(self.base_verticies[thi][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[thi][(phi+1)%len(self.base_verticies[0])], self.pos))

                glColor((0,0,0))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][phi], self.pos))
                glVertex3fv(addt(self.base_verticies[thi][(phi+1)%len(self.base_verticies[0])], self.pos))
                glVertex3fv(addt(self.base_verticies[(thi+1)%len(self.base_verticies)][(phi+1)%len(self.base_verticies[0])], self.pos))

        glEnd()



def main():
    pygame.init()
    display = (1200,800)
    pygame.display.set_mode(display, DOUBLEBUF|OPENGL)

    gluPerspective(45, (display[0]/display[1]), 0.1, 50.0)

    glTranslatef(0.0,0.0, -5)

    cubes = [Asteroid((2,0,0), size=0.1), Asteroid((0,0,0),size=0.5)]

    # background
    glClearColor(1,1,0,0)

    while True:
        keys = pygame.key.get_pressed()  #checking pressed keys
        if keys[pygame.K_a]:
            glRotatef(1, 0, 1, 0)
        if keys[pygame.K_d]:
            glRotatef(1, 0, -1, 0) 
        if keys[pygame.K_w]:
            glRotatef(1, 0, 0, 1)
        if keys[pygame.K_s]:
            glRotatef(1, 0, 0, -1) 
        if keys[pygame.K_DOWN]:
            glRotatef(1, 1, 0, 0)
        if keys[pygame.K_UP]:
            glRotatef(1, -1, 0, 0)

        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key==pygame.K_d:
                    print("d")
                elif event.key == pygame.K_a:
                    print("a")
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT)
        
        for cube in cubes:
            cube.draw()

        pygame.display.flip()
        pygame.time.wait(10)


if __name__ == "__main__":
    main()
