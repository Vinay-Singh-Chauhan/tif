This Nodejs API is made for an SaaS Platform that enables user to make their communities and add members to it.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Following are the endpoints:

Category: Role
--------------
Name	    URL
Create	    POST /v1/role
Get All	    GET /v1/role


Category: User    
------------
Name	    URL
Sign Up	    POST /v1/auth/signup
Sign in	    POST /v1/auth/signin
Get Me	    GET /v1/auth/me


Category: Community
-------------------
Name	                    URL
Create	                    POST /v1/community
Get All	                    GET /v1/community
Get All Members	            GET /v1/community/:id/members *
Get My Owned Community	    GET /v1/community/me/owner
Get My Joined Community	    GET /v1/community/me/member


Category: Member
----------------
Name	        URL
Add Member	    POST /v1/member
Remove Member	DELETE /v1/member/:id


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Some Peculiarities:

*while Getting all members of a community the path variable id refers to the id of Community not name. Although we can go with name of the Community as well but i have implemented it for ID.

for example : 
this works  : /v1/community/7075912180877861243/members
this does not work : /v1/community/bestever-community/members

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~