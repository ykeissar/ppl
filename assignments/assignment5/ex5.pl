:- module('ex5',
        [activity/2,
         parents/3,
         participate/2,
         parent_details/3,
         not_member/2,
         findall/3 
        ]).

/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).
   
% Signature: activity(Name,Day)/2
% Purpose: describe an activity at the country club and the day it takes place
%
activity(swimming,sunday).
activity(ballet,monday).
activity(judu,tuesday).
activity(soccer,wednesday).
activity(art,sunday).
activity(yoga,tuesday).

% Signature: parents(Child,Parent1,Parent2)/3
% Purpose: parents - child relation
%
parents(dany,hagit,yossi).
parents(dana,hagit,yossi).
parents(guy,meir,dikla).
parents(shai,dor,meni).

% Signature: participate(Child_name,Activity)/2
% Purpose: registration details
%
participate(dany,swimming).
participate(dany,ballet).
participate(dana,soccer).
participate(dana,judu).
participate(guy,judu).
participate(shai,soccer).

% Signature: parent_details(Name,Phone,Has_car)/3
% Purpose: parents details
%
parent_details(hagit,"0545661332",true).
parent_details(yossi,"0545661432",true).
parent_details(meir,"0545661442",false).
parent_details(dikla,"0545441332",true).
parent_details(dor,"0545881332",false).
parent_details(meni,"0545677332",true).

% Signature: not_member(Element, List)/2
% Purpose: The relation in which Element is not a member of a List.
%
not_member(_, []).
not_member(X, [Y|Ys]) :- X \= Y,
                         not_member(X, Ys).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% To Do

% Signature: pick_me_up(Child_name,Phone)/2
% Purpose: The relation between a child name and its parent phone number, when the parent has a car.

pick_me_up(C,N) :- parents(C,P1,_),parent_details(P1,N,true).
pick_me_up(C,N) :- parents(C,_,P2),parent_details(P2,N,true).

% Signature: active_child(Name)/1
% Purpose: Returns true when a child participates in at least two activities.

active_child(C) :- participate(C,X),participate(C,Y),X \= Y.

% Signature: activity_participants_list(Activity, List)/2
% Purpose: The  is a relationship between an activity name 
% and list of all the children's names that participate at this activity.


activity_participants_list(A, L) :- activity(A,_),findall(C,participate(C,A),L).

% Signature: can_register(Child_name,Activity)/2
% Purpose: The relation between a child name and an activity that the child can register to.

participate_in_day(C,A,D) :- participate(C,A),activity(A,D).

can_register(C,A) :- findall(D2,participate_in_day(C,_,D2),L),activity(A,D),not_member(D,L).

