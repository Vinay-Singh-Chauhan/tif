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

Kindly visit: https://github.com/Vinay-Singh-Chauhan/tif